import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';

import Payment from './component';
import {
  sendOperation,
  getDestinationTrustlines,
} from '../../../actions-creators/stellar';

import {
  canSign,
  getAccount,
} from '../../../selectors/account';
import {
  getTrustlines,
} from '../../../selectors/stellarData';

import {
  getDestinationTrustlines as getDestinationTrustlinesSelector,
  isSendingPayment,
  isModalKeypairOpen,
} from '../../../selectors/ui';

import { openKeypairModal, closeKeypairModal } from '../../../actions/ui';

const FORM_NAME = 'payment-form';

const mapStateToProps = state => ({
  account: getAccount(state),
  trustlines: getTrustlines(state),
  canSign: canSign(state),
  sendingPayment: isSendingPayment(state),
  destinationTruslines: getDestinationTrustlinesSelector(state),

  keypairModalOpen: isModalKeypairOpen(state),

  values: getFormValues(FORM_NAME)(state),
});

const mapDispatchToProps = {
  sendOperation,
  getDestinationTrustlines,
  closeKeypairModal,
  openKeypairModal,
};

export default reduxForm({
  form: FORM_NAME, // a unique name for this form
  initialValues: {
    memo: {
      type: 'none',
    },
  },
})(connect(mapStateToProps, mapDispatchToProps)(Payment));
