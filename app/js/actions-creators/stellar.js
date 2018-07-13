import * as StellarOperations from '../helpers/StellarOperations';
import { newStream } from '../helpers/monoStreamer';
import { ASYNC_SEND_OPERATION, ASYNC_CREATE_TRUSTLINE, ASYNC_GET_ORDERBOOK, ASYNC_GET_PRICE, ASYNC_GET_ORDERBOOKISCHANGED,
    ASYNC_GET_AMCHART, ASYNC_GET_TRADES, ASYNC_GET_SELLBUYCHANGED, ASYNC_GET_TRADESAGGREGATION, ASYNC_GET_SELLBUY,
    ASYNC_GET_TICKER, ASYNC_GET_HIGHHLOW, ASYNC_GET_ASSETS } from '../constants/asyncActions';
import { AsyncActions } from '../helpers/asyncActions';
import { AssetInstance } from '../helpers/StellarTools';
import * as StellarServer from '../helpers/StellarServer';
import * as StellarActions from '../actions/stellar';
import * as UiActions from '../actions/ui';

import {
  getAccount as getAccountSelector,
  getAuthData,
} from '../selectors/account';
import {
  getTrustlines as getTrustlinesSelector,
} from '../selectors/stellarData';
import {
  getDestinationTrustlines as getDestinationTrustlinesSelector,
} from '../selectors/ui';

export const OPERATIONS = {
  PAYMENT: 'payment',
  PATH_PAYMENT: 'path_payment',
  ISSUE_ASSET: 'issue_asset',
  CREATE_ACCOUNT: 'create_account',
  ACCOUNT_MERGE: 'account_merge',
};


const sendOperationRedux = (transaction, dispatch) => {
  dispatch(AsyncActions.startFetch(ASYNC_SEND_OPERATION));

  return transaction
    .then((d) => {
      dispatch(AsyncActions.successFetch(ASYNC_SEND_OPERATION, d));
    })
    .catch((error) => {
      dispatch(AsyncActions.errorFetch(ASYNC_SEND_OPERATION, error));
      dispatch(UiActions.openErrorModal(error));
    });
};

export const sendPayment = paymentData => (dispatch, getState) => {
  const authData = getAuthData(getState());

  return sendOperationRedux(StellarOperations.sendPayment(paymentData, authData), dispatch);
};

export const sendPathPayment = paymentData => (dispatch, getState) => {
  const authData = getAuthData(getState());

  return sendOperationRedux(StellarOperations.sendPathPayment(paymentData, authData), dispatch);
};

export const sendIssuePayment = formData => (dispatch, getState) => {
  const authData = getAuthData(getState());
  const { accountId, asset_code, amount, destination } = formData;
  const asset = { asset_code, asset_issuer: accountId };
  const paymentData = {
    asset,
    amount,
    destination,
  };
  return sendOperationRedux(StellarOperations.sendPayment(paymentData, authData), dispatch);
};

export const sendCreateAccount = accountData => (dispatch, getState) => {
  const authData = getAuthData(getState());
  return sendOperationRedux(StellarOperations.createAccount(accountData, authData), dispatch);
};

export const sendAccountMerge = accountData => (dispatch, getState) => {
  const authData = getAuthData(getState());
  return sendOperationRedux(StellarOperations.accountMerge(accountData, authData), dispatch);
};

const changeTrust = ({ asset, limit }) => (dispatch, getState) => {
  const authData = getAuthData(getState());
  if (!authData) return Promise.reject();

  const transactionData = {
    asset,
    limit,
  };

  return StellarOperations
    .changeTrust(transactionData, authData)
    .catch((error) => {
      dispatch(UiActions.openErrorModal(error));
    });
};

export const createTrustline = asset => (dispatch) => {
  // console.log("createTrustline", asset);
    //TODO create trusline async dispatch
  dispatch(AsyncActions.startLoading(ASYNC_CREATE_TRUSTLINE));

  dispatch(changeTrust({ asset, limit: null }))
    .then(() => {
      dispatch(AsyncActions.stopLoading(ASYNC_CREATE_TRUSTLINE));
    })
    .catch((error) => {
      dispatch(UiActions.openErrorModal(error));
      dispatch(AsyncActions.stopLoading(ASYNC_CREATE_TRUSTLINE));
    });
};

export const deleteTrustline = (asset, balances) => (dispatch) => {
  dispatch(UiActions.deletingTrustline(asset, balances));

  dispatch(changeTrust({ asset, limit: 0 }))
    .catch((error) => {
      dispatch(UiActions.openErrorModal(error));
    });
};

export const createOffer = offer => (dispatch, getState) => {
  dispatch(UiActions.sendingOffer());
  const authData = getAuthData(getState());
  if (!authData) return Promise.reject();
  return StellarOperations
    .manageOffer(offer, authData)
    .then((d) => {
      dispatch(UiActions.sendOfferSuccess(d));
    })
    .catch((error) => {
      dispatch(UiActions.openErrorModal(error));
    });
};

export const deleteOffer = offer => (dispatch, getState) => {
  dispatch(UiActions.deletingOffer(offer));

  const authData = getAuthData(getState());
  if (!authData) return Promise.reject();

  const transactionData = {
    ...offer,
    amount: 0,
  };

  return StellarOperations
    .manageOffer(transactionData, authData)
    .then(() => true)
    .catch((error) => {
      dispatch(UiActions.openErrorModal(error));
    });
};

//setSelling Buying
export const setSellingBuying = ({sellingData, buyingData}) => (dispatch) => {
    const dataForBuySell = [sellingData, buyingData];
    dispatch(AsyncActions.successFetch(ASYNC_GET_SELLBUY, dataForBuySell))
};

export const setTradesAggregation = ({buyingTrades, sellingTrades}, onUpdate) => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_TRADESAGGREGATION));

        // this.ready = false;
        let trades;
        let smoothTrades = (trades) => {
            let result = [];
            for (let i = 2; i < trades.length; i++) {
                let a = Number(trades[i-2][1]);
                let b = Number(trades[i-1][1]);
                let c = Number(trades[i  ][1]);

                let ratioA = c/a;
                let ratioB = c/b;
                let geometricAbsoluteDiffA = ratioA > 1 ? ratioA - 1 : 1/ratioA - 1;
                let geometricAbsoluteDiffB = ratioB > 1 ? ratioB - 1 : 1/ratioB - 1;
                if (geometricAbsoluteDiffA > 0.3 && geometricAbsoluteDiffB > 0.3) {

                    result.push([trades[i][0], [a,b,c].sort()[1]]);

                } else {
                    result.push(trades[i]);
                }
            }
            return result
        }

        let firstFullFetchFinished = false;
        let closed;
        let close;
        let fetchManyTrades = async () => {
            let records = [];
            let recentRecords = [];
            let satisfied = false;
            let first = true;
            let depth = 0;
            const MAX_DEPTH = 20;
            let prevCall;
            let startTime = Date.now();
            let fetchTimeout = 20000; // milliseconds before we stop fetching history
            let nowDate = Date.now() + 86400000;
            let result;
            let resultRecent;

            while (!closed && !satisfied && depth < MAX_DEPTH && Date.now() - startTime < fetchTimeout) {
                depth += 1;
                let tradeResults;
                let tradeRecent;
                if (first) {

                    tradeResults = await StellarServer.getServerInstance().tradeAggregation(buyingTrades, sellingTrades, 1514764800, Date.now() + 86400000, 900000).limit(200).order('desc').call();

                    dispatch(AsyncActions.successFetch(ASYNC_GET_HIGHHLOW, tradeResults));
                    // console.log("tradeResults", tradeResults);

                    first = false;
                }
                else {

                    tradeResults = await prevCall();

                }

                prevCall = tradeResults.next;


                records.push(...tradeResults.records);

                if (tradeResults.records.length < 200) {
                    satisfied = true;
                }

                // Optimization: use this filter before saving it into the records array
                result = _.filter(
                    _.map(records, (trade) => {
                        return [new Date(trade.timestamp).getTime(), parseFloat(trade.close)];
                    }),
                    (entry) => {
                        return !isNaN(entry[1]);
                    }
                );

                result.sort((a,b) => {
                    return a[0]-b[0];
                });

                if (!firstFullFetchFinished) {
                    trades = smoothTrades(result);
                }
                if (depth > 1) {
                    // onUpdate();
                }
            }
            firstFullFetchFinished = true;


            trades = smoothTrades(result);

            dispatch(AsyncActions.successFetch(ASYNC_GET_TRADESAGGREGATION, trades));

            // console.log("records", trades);

            // console.log()

            // onUpdate();

            setTimeout(() => {
                if (!closed) {
                    fetchManyTrades();
                }
            }, 5*60*1000);
        };

        fetchManyTrades();

        close = () => {
            closed = true;
        };
    return true;
};



//set trades data
export const setTrades = ({buying, selling}) => (dispatch) => {
    dispatch(AsyncActions.startFetch(ASYNC_GET_TRADES));
    // TODO move to middleware
    newStream('trades',
        StellarServer
            .TradesStream({buying, selling}, (trades) => {
                dispatch(AsyncActions.successFetch(ASYNC_GET_TRADES, trades));
            }),
    );
    return true;
};

//setTicker
export const setTicker = (data) => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_TICKER, data));
    return true;
};

export const resetTrades = () => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_TRADES, null))
};

export const setOrderbook = ({ selling, buying }) => (dispatch) => {
  dispatch(AsyncActions.startFetch(ASYNC_GET_ORDERBOOK));
   // console.log("selling", selling);
   // console.log("buying", buying);
  // TODO move to middleware
  newStream('orderbook',
    StellarServer
      .OrderbookStream({ selling, buying }, (orderbook) => {
        dispatch(AsyncActions.successFetch(ASYNC_GET_ORDERBOOK, orderbook));
      }),
  );
  return true;
};

export const resetOrderbook = () => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_ORDERBOOK, null))
};

export const setPrice = ({prData}) => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_PRICE, prData))
};


export const setAmcharData = ({amData}) => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_AMCHART, amData))
};

export const setSellBuy = ({sellBuy}) => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_SELLBUYCHANGED, sellBuy))
};

export const setOrderbookIsChanged = ({isChange}) => (dispatch) => {
    dispatch(AsyncActions.successFetch(ASYNC_GET_ORDERBOOKISCHANGED, isChange))
};

//TODO add assets to balance
export const getDestinationTrustlines = accountId => (dispatch) => {
  StellarServer.getAccount(accountId)
    .then(account => account.balances.map(balance => ({
      asset_type: balance.asset_type,
      asset_code: balance.asset_code,
      asset_issuer: balance.asset_issuer,
    })).map(AssetInstance))
    .then(trustlines => dispatch(StellarActions.setDestinationTrustlines(trustlines)))
    .catch(() => dispatch(StellarActions.setDestinationTrustlines([])));
};

export const sendOperation = (type, formData) => (dispatch, getState) => {
  const state = getState();
  const account = getAccountSelector(state);
  const trustlines = getTrustlinesSelector(state);
  const destinationTruslines = getDestinationTrustlinesSelector(state);

  const operationData = { ...formData };

  // console.log("type", type);
  // console.log("formData", formData);
  switch (type) {
    case OPERATIONS.PAYMENT: {
      operationData.asset = trustlines[operationData.asset];
      // console.log(operationData);
      return dispatch(sendPayment(operationData));
    }
    case OPERATIONS.PATH_PAYMENT: {
      operationData.asset_source =
        trustlines[operationData.asset_source];
      operationData.asset_destination =
        destinationTruslines[operationData.asset_destination];
      return dispatch(sendPathPayment(operationData));
    }
    case OPERATIONS.ISSUE_ASSET: {
      operationData.accountId = account.account_id;
        return dispatch(sendIssuePayment(operationData));
    }
    case OPERATIONS.CREATE_ACCOUNT: {
      return dispatch(sendCreateAccount(operationData));
    }
    case OPERATIONS.ACCOUNT_MERGE: {
      return dispatch(sendAccountMerge(operationData));
    }
    default:
      return Promise.reject();
  }
};
