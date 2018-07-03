import { connect } from 'react-redux';

import Balances from './component';
import { getOrderbook } from '../../../selectors/stellarData';
import { canSign, getBalances } from '../../../selectors/account';
import { isCreatingTrustline } from '../../../selectors/ui';
import { createTrustline, deleteTrustline } from '../../../actions-creators/stellar';
import {getTrustlines} from "js/selectors/stellarData";

const mapStateToProps = state => ({
  balances: getBalances(state),
  canSign: canSign(state),
  trustlines: getTrustlines(state),
  creatingTrustline: isCreatingTrustline(state),
    // orderbook: getOrderbook(state),
});

const mapDispatchToProps = {
  createTrustline,
  deleteTrustline,
};

export default connect(mapStateToProps, mapDispatchToProps)(Balances);
