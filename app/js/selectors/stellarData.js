import { createSelector } from 'reselect';
import { selectProperty } from '../helpers/redux';
import { asyncSelectorObject } from '../helpers/asyncActions/selectors';
import { ASYNC_GET_ORDERBOOK, ASYNC_GET_PRICE, ASYNC_GET_TRADES, ASYNC_GET_ORDERBOOKISCHANGED,  ASYNC_GET_SELLBUYCHANGED,
    ASYNC_GET_TICKER, ASYNC_GET_TRADESAGGREGATION, ASYNC_GET_SELLBUY, ASYNC_GET_AMCHART, ASYNC_GET_HIGHHLOW} from '../constants/asyncActions';

import { getBalances } from './account';
import { STELLAR_STATE_KEY } from '../constants/reducerKeys';
import { EFFECTS_KEY, PAYMENTS_KEY, OFFERS_KEY, NETWORK_KEY } from '../reducers/stellar';

export const getNetwork = selectProperty([STELLAR_STATE_KEY, NETWORK_KEY, 'network'], '');

export const getOffers = selectProperty([STELLAR_STATE_KEY, OFFERS_KEY, 'data'], []);

//get orderbook
export const getOrderbook = asyncSelectorObject(ASYNC_GET_ORDERBOOK).data;

//get trades
export const getTrades = asyncSelectorObject(ASYNC_GET_TRADES).data;

//get tradesAggregations
export const getTradesAggregations = asyncSelectorObject(ASYNC_GET_TRADESAGGREGATION).data;

//get tradesAggregations
export const getTradesAggregationsHightLow = asyncSelectorObject(ASYNC_GET_HIGHHLOW).data;

//get sell buy
export const getSellingBuying = asyncSelectorObject(ASYNC_GET_SELLBUY).data;

export const getAmChartData = asyncSelectorObject(ASYNC_GET_AMCHART).data;

export const getPrice = asyncSelectorObject(ASYNC_GET_PRICE).data;

export const getOrderbookIsChanged = asyncSelectorObject(ASYNC_GET_ORDERBOOKISCHANGED).data;

export const getTicker = asyncSelectorObject(ASYNC_GET_TICKER).data;

export const getSellBuyIsChanged = asyncSelectorObject(ASYNC_GET_SELLBUYCHANGED).data;

export const isFetchingOrderbook = asyncSelectorObject(ASYNC_GET_ORDERBOOK).isLoading;

export const getTrustlines = createSelector(
  getBalances,
  balances => balances.map(b => b.asset),
);

const getPayments = selectProperty([STELLAR_STATE_KEY, PAYMENTS_KEY, 'data'], []);
const getEffects = selectProperty([STELLAR_STATE_KEY, EFFECTS_KEY, 'data'], []);

export const getPaymentsFromPayments = createSelector(
  getPayments,
  payments => payments.filter(payment => (
    (payment.type === 'payment') && (payment.from !== payment.to)
  )),
);

export const getPathPaymentsFromPayments = createSelector(
  getPayments,
  payments => payments.filter(payment => (
    (payment.type === 'path_payment') && (payment.from !== payment.to)
  )),
);

export const getPaymentsFromEffects = createSelector(
  getEffects,
  effects => effects.filter(effect => (
    effect.type === 'account_credited' || effect.type === 'account_debited'
  )),
);

export const getPathPaymentsFromEffects = createSelector(
  getEffects,
  effects => effects.filter(effect => (
    (effect.type === 'account_credited') || (effect.type === 'account_debited')
  )),
);
