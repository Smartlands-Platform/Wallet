import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';

import { createTestAccount, setAccount, switchNetwork } from '../../../actions-creators/account';

import AccountSelector from './component';
import {
  isAccountLoading,
  isCreatingTestAccount,
  getAccountError,
  getKeypair,
  canSign,
} from '../../../selectors/account';

import { isModalKeypairOpen } from '../../../selectors/ui';
import { openKeypairModal, closeKeypairModal } from '../../../actions/ui';

import {
  getNetwork,
} from '../../../selectors/stellarData';

const FORM_NAME = 'account-selector';

const mapStateToProps = state => ({
  isAccountLoading: isAccountLoading(state),
  isCreatingTestAccount: isCreatingTestAccount(state),
  canSign: canSign(state),
  error: getAccountError(state),
  keypair: getKeypair(state),
  network: getNetwork(state),

  keypairModalOpen: isModalKeypairOpen(state),

  values: getFormValues(FORM_NAME)(state),
});

const mapDispatchToProps = {
  setAccount,
  switchNetwork,
  createTestAccount,
  closeKeypairModal,
  openKeypairModal,
};

export default reduxForm({
  form: FORM_NAME,
  initialValues: {},
})(connect(mapStateToProps, mapDispatchToProps)(AccountSelector));
