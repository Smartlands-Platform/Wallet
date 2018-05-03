import React, { PropTypes } from 'react';
import { Button, Container, Message, Modal } from 'semantic-ui-react';
import { Keypair } from 'stellar-sdk';

import AccountKeyViewer from '../../StellarContainers/CurrentAccount';

class KeypairGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keypair: null,
      open: false,
    };
  }

  generateKeypair() {
    this.setState({ keypair: Keypair.random() });
  }

  cancelCloses() {
    this.setState({ open: false });
  }

  confirmCloses() {
    this.setState({ open: false });
    this.setState({ keypair: null });
    this.props.close();
  }

  closeGenerateKeypair() {
    if (this.state.keypair) {
      this.setState({ open: true });
    } else {
      this.props.close();
    }
  }

  render() {
    return (
      <Modal open={this.props.open} className="generate-modal">
        <Modal.Header>Account Keypair Generator</Modal.Header>
        <Modal.Content>
          <Container>
            <Message info size="big">
              <Message.Header>The account keypair consists of two parts:</Message.Header>
              <p>
                Public key: The public key is used to identify the account. It is also oftenly refered to as an account or an address.
                A public key is used for receiving funds or checking balances with block explorers.
              </p>
              <p>
                Private key: The private (or secret) key is used to access your account and make transactions.
                Keep this code safe and secure. Anyone with the code will have full access to the account and funds.
                Don’t lose the key, as you will no longer be able to access the funds and there is no recovery mechanism.
              </p>
            </Message>
          </Container>
          <Modal size={'small'} open={this.state.open}>
            <Modal.Header>
              Close Keypair Generator
            </Modal.Header>
            <Modal.Content>
              <h4>Are you sure to want to close the generator keypair? If you don't save the keys, you can't recover them</h4>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={::this.cancelCloses}>
                No
              </Button>
              <Button onClick={::this.confirmCloses} positive icon="checkmark" labelPosition="right" content="Yes" />
            </Modal.Actions>
          </Modal>
        </Modal.Content>
        <Modal.Content>
          {!!this.state.keypair && <AccountKeyViewer keypair={this.state.keypair} showSeed showString/>}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={::this.generateKeypair} primary>Generate</Button>
          <Button onClick={::this.closeGenerateKeypair} secondary>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

KeypairGenerator.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
};

export default KeypairGenerator;
