import { connect } from 'react-redux';
import Component from './component';

import { getTrades, getOrderbook, getOrderbookIsChanged, getSellBuyIsChanged, getTrustlines } from '../../selectors/stellarData';
import { setTrades} from '../../actions-creators/stellar';

const mapStateToProps = state => ({
  orderbook: getOrderbook(state),
  trades: getTrades(state),
  orderbookIsChanged: getOrderbookIsChanged(state),
    sellBuyChange: getSellBuyIsChanged(state),
    trustlines: getTrustlines(state),
});

const mapDispatchToProps = { setTrades };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
