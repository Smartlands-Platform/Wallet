import { connect } from 'react-redux';
import Component from './component';

import { isSendingOffer } from '../../../selectors/ui';
import { canSign, getBalances } from '../../../selectors/account';
import { getOffers, getTrustlines, isFetchingOrderbook, getOrderbook, getPrice, getOrderbookIsChanged} from '../../../selectors/stellarData';
import { resetAccount } from '../../../actions-creators/account';
import { createOffer, deleteOffer } from '../../../actions-creators/stellar';
import {
    getKeypair,
} from '../../../selectors/account';

const mapStateToProps = state => ({
    balances: getBalances(state),
  offers: getOffers(state),
  trustlines: getTrustlines(state),
  orderbook: getOrderbook(state),
  isFetching: isFetchingOrderbook(state),
  canSign: canSign(state),
  priceData: getPrice(state),
  sendingOffer: isSendingOffer(state),
    orderbookIsChanged: getOrderbookIsChanged(state),
    keypair: getKeypair(state),

});

const mapDispatchToProps = { createOffer, deleteOffer, resetAccount };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
