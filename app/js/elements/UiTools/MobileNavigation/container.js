import { connect } from 'react-redux';

import MobileNavigation from './component';
import { resetAccount } from '../../../actions-creators/account';
import { isModalKeypairOpen } from '../../../selectors/ui';

import { openKeypairModal, closeKeypairModal } from '../../../actions/ui';

const mapDispatchToProps = {
  resetAccount,
  closeKeypairModal,
  openKeypairModal,
};

const mapStateToProps = state => ({
  keypairModalOpen: isModalKeypairOpen(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileNavigation);
