import React, { PropTypes } from 'react';
import { Container, Menu } from 'semantic-ui-react';

import NetworkSwitcher from '../../../elements/UiTools/NetworkSwitcher';
import AccountSwitcher from '../../../elements/UiTools/AccountSwitcher';
import MobileNavigation from '../../../elements/UiTools/MobileNavigation';
import KeypairGenerator from '../../../elements/UiTools/KeypairGenerator';

import { downloadDeskBuild } from '../../../helpers/common';

import '../../../../styles/top_bar.scss';

const userAgent = navigator.userAgent.toLowerCase();

const Layout = ({ keypair, goHome, keypairModalOpen, openKeypairModal, closeKeypairModal }) =>
    <Menu className="top-bar-menu" fixed="top" inverted secondary>
      <Container>
        <Menu.Item onClick={goHome} className="logo" />
        <Menu.Item className="note">
          <strong>Beta-version, testnet.</strong>
        </Menu.Item>
        <Menu.Item position="right">
          { window.innerWidth > 767 && userAgent.indexOf(' electron/') === -1
            ? <a onClick={downloadDeskBuild.bind(downloadDeskBuild, 'mac')}>
              <button className="btn grey">Download for Mac</button>
            </a>
            : null }
        </Menu.Item>
        <Menu.Item>
          { window.innerWidth > 767 && userAgent.indexOf(' electron/') === -1
            ? <a onClick={downloadDeskBuild.bind(downloadDeskBuild, 'win')}>
              <button className="btn grey">Download for Windows</button>
            </a>
            : null }
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
