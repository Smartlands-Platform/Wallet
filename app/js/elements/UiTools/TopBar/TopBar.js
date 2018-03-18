import React, { PropTypes } from 'react';
import { Container, Menu } from 'semantic-ui-react';

import NetworkSwitcher from '../../../elements/UiTools/NetworkSwitcher';
import AccountSwitcher from '../../../elements/UiTools/AccountSwitcher';
import MobileNavigation from '../../../elements/UiTools/MobileNavigation';
import KeypairGenerator from '../../../elements/UiTools/KeypairGenerator';

import icon from '../../../../../content/assets/images/logo.png';

import '../../../../styles/top_bar.scss';

function duplicateTab() {
  window.open(window.location.href);
}

const Layout = ({ keypair, goHome, keypairModalOpen, openKeypairModal, closeKeypairModal }) =>
    <Menu className="top-bar-menu" fixed="top" inverted secondary>
      <Container>
        <Menu.Item onClick={goHome} className="logo" />
        <Menu.Item className="note">
          <strong>Beta-version, testnet.</strong>
        </Menu.Item>
        <Menu.Item position="right">
          { window.innerWidth > 767
            ? <button className="btn gray" onClick={openKeypairModal}>Keypair generator</button>
            : null }
          <KeypairGenerator open={keypairModalOpen} close={closeKeypairModal} />
        </Menu.Item>
        { window.innerWidth < 768 ?
          <Menu.Item>
            <MobileNavigation openModel={openKeypairModal} />
          </Menu.Item>
          : null }
        {keypair && window.innerWidth > 767 ?
          <Menu.Item>
            <AccountSwitcher />
          </Menu.Item>
          : null }
        {/*<Menu.Item>*/}
        {/*<NetworkSwitcher />*/}
        {/*</Menu.Item>*/}
      </Container>
    </Menu>;

Layout.propTypes = {
  goHome: PropTypes.func.isRequired,
  openKeypairModal: PropTypes.func.isRequired,
  closeKeypairModal: PropTypes.func.isRequired,
  keypair: PropTypes.object,
  keypairModalOpen: PropTypes.bool,
};

export default Layout;
