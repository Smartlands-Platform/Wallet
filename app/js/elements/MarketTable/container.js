import { connect } from 'react-redux';
import Component from './component';

import { getTicker, getOrderbook, getTradesAggregationsHightLow, getOrderbookIsChanged} from '../../selectors/stellarData';

const mapStateToProps = state => ({
    orderbook: getOrderbook(state),
    tickerData: getTicker(state),
    tradeHightLow: getTradesAggregationsHightLow(state),
    orderbookIsChanged: getOrderbookIsChanged(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, null)(Component);
