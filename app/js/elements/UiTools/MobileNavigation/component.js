import React, { PropTypes } from 'react';
import {Container, Modal } from 'semantic-ui-react';

import icon2 from '../../../../../content/assets/images/keypair-gen.png'

import KeypairGenerator from '../../../elements/UiTools/KeypairGenerator';

class MobileNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNavigation: false,
    }
  }

  openKeypairModal(e) {
    e.preventDefault();
    this.props.openKeypairModal();
    this.toggleNavigation();
  }

  toggleNavigation() {
    this.setState({showNavigation: !this.state.showNavigation});
    console.log('toggleNavigation this.state.showNavigation', this.state.showNavigation);
  }

  get renderNavigationModal() {
    const {resetAccount} = this.props;

    return (
      <Modal dimmer={false} className="navigation-modal" open={this.state.showNavigation}>
        <Modal.Content>
          <Container>
            <div className="nav">
              <a href="#" onClick={::this.openKeypairModal}>Keypair generator</a>
            </div>
            <div className="nav">
              <a className="nav" href="#" onClick={resetAccount}>Change account</a>
            </div>
          </Container>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        <button className="navigation-box btn-img" onClick={::this.toggleNavigation}><img src={icon2} /></button>
        <KeypairGenerator open={this.props.keypairModalOpen} close={this.props.closeKeypairModal} />
        {this.renderNavigationModal}
      </div>
    );
  }
}

// MobileNavigation.propTypes = {
//   resetAccount: PropTypes.func.isRequired,
// };

export default MobileNavigation;
