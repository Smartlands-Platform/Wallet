import { connect } from 'react-redux';
import Component from './component';

import {getTrustlines, isFetchingOrderbook, getOrderbook, getPrice, getOrderbookIsChanged, getSellBuyIsChanged, getTradesAggregations, getSellingBuying} from '../../../selectors/stellarData';
import { setOrderbook, createTrustline, deleteTrustline, resetOrderbook, setPrice, setTrades, setOrderbookIsChanged, setSellBuy, resetTrades, setTradesAggregation, setSellingBuying, setTicker} from '../../../actions-creators/stellar';
import { isCreatingTrustline } from '../../../selectors/ui';

const mapStateToProps = state => ({
  isFetching: isFetchingOrderbook(state),
  orderbook: getOrderbook(state),
  priceData: getPrice(state),
  orderbookIsChanged: getOrderbookIsChanged(state),
  sellBuyIsChanged: getSellBuyIsChanged(state),
  // trades: getTrades(state),
  trustlines: getTrustlines(state),
  creatingTrustline: isCreatingTrustline(state),
  tradesAggregations: getTradesAggregations(state),
  sellBuyData: getSellingBuying(state),
});

const mapDispatchToProps = { setOrderbook, createTrustline, deleteTrustline, resetOrderbook, setPrice, setTrades, setOrderbookIsChanged, setSellBuy, resetTrades, setTradesAggregation, setSellingBuying, setTicker };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
