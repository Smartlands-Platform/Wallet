import { connect } from 'react-redux';
import Component from './component';

import { getTrustlines, isFetchingOrderbook, getOrderbook, getOffers } from '../../../selectors/stellarData';
import { setOrderbook, createTrustline, deleteTrustline, resetOrderbook } from '../../../actions-creators/stellar';
import { isCreatingTrustline } from '../../../selectors/ui';

const mapStateToProps = state => ({
  isFetching: isFetchingOrderbook(state),
  orderbook: getOrderbook(state),
  trustlines: getTrustlines(state),
  creatingTrustline: isCreatingTrustline(state),
});

const mapDispatchToProps = { setOrderbook, createTrustline, deleteTrustline, resetOrderbook };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
