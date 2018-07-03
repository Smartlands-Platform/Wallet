import { connect } from 'react-redux';
import Component from './component';
import depthChart from './depth_chart';

import { getOrderbook, getTradesAggregations, getSellingBuying } from '../../selectors/stellarData';
import { setTradesAggregation } from '../../actions-creators/stellar';

const mapStateToProps = state => ({
  // isFetching: isFetchingOrderbook(state),
  orderbook: getOrderbook(state),
    tradesAggregations: getTradesAggregations(state),
    sellBuyData: getSellingBuying(state),

  // trustlines: getTrustlines(state),
});

const mapDispatchToProps = { setTradesAggregation };

// const components = {Component, depthChart};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
