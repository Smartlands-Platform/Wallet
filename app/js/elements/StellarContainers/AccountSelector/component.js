import React, { Component, PropTypes } from 'react';
import { Form, Container, Button, Message } from 'semantic-ui-react';
import Clipboard from 'clipboard';
import { Field, propTypes } from 'redux-form';

import * as StellarHelper from '../../../helpers/StellarTools';
import InputFormField from '../../UiTools/SemanticForm/Input';
import KeypairGenerator from '../../../elements/UiTools/KeypairGenerator';

import '../../../../styles/account_selector.scss';

const styles = {
  inputContainer: {
    width: '720px',
    maxWidth: '90%',
    margin: 'auto',
  },
  link: {
    textDecoration: 'none',
    color: '#2185d0',
    marginLeft: '4px',
  },
  label: {
    marginLeft: '10px',
  },
};

class AccountSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAccept: true,
      keypair: null,
      showSeed: false,
      resolving: false,
    };
    if (this.props.keypair) {
      this.state.accountId = this.props.keypair.publicKey();
      this.state.secretSeed = this.props.keypair.canSign() ? this.props.keypair.secret() : '';
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.keypair !== newProps.keypair) {
      if (newProps.keypair) {
        this.setState({
          accountId: newProps.keypair.publicKey(),
          secretSeed: newProps.keypair.canSign() ? newProps.keypair.secret() : '',
        });
      } else {
        this.setState({
          accountId: '',
          secretSeed: '',
        });
      }
    }
  }


  componentDidMount() {
    this.props.switchNetwork('test');
    new Clipboard('.account-address-copy'); // eslint-disable-line no-new
  }

  toggleChange = () => {
    this.setState({ isAccept: !this.state.isAccept });
  }

  handleAddress(e, newAddress) {
    this.setState({ resolving: true });
    const address = newAddress;

    const isSeed = StellarHelper.validSeed(address);
    if (isSeed) {
      const keypair = StellarHelper.KeypairInstance({ secretSeed: address });
      this.setState({
        keypair,
        resolving: false,
      });
      return;
    }

    StellarHelper.resolveAddress(address)
      .then((resolved) => {
        const keypair = StellarHelper.KeypairInstance({ publicKey: resolved.account_id });
        this.setState({
          keypair,
          resolving: false,
        });
      })
      .catch(() => {
        this.setState({
          keypair: null,
          resolving: false,
        });
      });
  }

  handleSet(e) {
    e.preventDefault();
    const keypair = this.state.keypair;
    if (!keypair) return;

    console.log('keypair', keypair)
    this.props.setAccount(keypair);
  }



  newForm() {
    const { values: { address } = {} } = this.props;

    let buttonLabel = 'Invalid address';
    const buttonContent = 'Login';
    let buttonColor = 'green';
    let disabled = true;
    if (this.state.keypair && this.state.isAccept) {
      buttonColor = 'green';
      disabled = false;
      if (this.state.keypair.canSign()) {
        buttonLabel = 'Seed';
      } else {
        buttonLabel = 'Public address';
      }
    } else if (!address) {
      buttonLabel = 'No address';
    }
    return (
      <div style={styles.inputCntainer}>
        <Field
          name="address"
          component={InputFormField}
          onChange={::this.handleAddress}
          type="text"
          placeholder="Enter private key"
          error={!!address && !this.state.keypair}
          fluid
          action={{
            color: buttonColor,
            disabled,
            content: buttonContent,
            onClick: ::this.handleSet,
            loading: this.state.resolving || this.props.isAccountLoading,
          }}
        />
        <form>
            <input
                type="checkbox"
                name="term"
                checked={this.state.isAccept}
                onChange={this.toggleChange}
            />
          <label style={styles.label}>
              By entering you agree to Smartlands'
            <a href="https://smartlands.io/pdf/Terms_of_use.pdf" target="_blank" rel="noopener" style={styles.link}>
                Terms of Use
            </a>
          </label>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Container textAlign="left">
          {this.newForm()}
          <br />
          {
            this.props.error ?
              <Message negative>
                <Message.Header>Account error</Message.Header>
                <p>There was an error while fetching this account's data.</p>
                <p>Either the account does not exists or you are on the wrong network.
                  Try to switch to public/testnet.</p>
              </Message>
              :
              null
          }

          {/*{*/}
            {/*this.props.network === 'test' &&*/}
            {/*<div>*/}
              {/*<Button*/}
                {/*icon="wizard"*/}
                {/*content="Create new account on testnet"*/}
                {/*color="green"*/}
                {/*loading={this.props.isCreatingTestAccount}*/}
                {/*onClick={this.props.createTestAccount}*/}
              {/*/>*/}
            {/*</div>*/}
          {/*}*/}
          <p className="note-text">No Smartlands wallet yet? Generate your keypair here:</p>
          <Button
            className="btn big green-white"
            content="Generate keypair"
            loading={this.props.isCreatingTestAccount}
            onClick={this.props.createTestAccount}
          />
          {/*onClick={this.props.openKeypairModal}*/}
          <KeypairGenerator open={this.props.keypairModalOpen} close={this.props.closeKeypairModal} />
        </Container>
      </div>
    );
  }
}

AccountSelector.propTypes = {
  isAccountLoading: PropTypes.bool,
  isCreatingTestAccount: PropTypes.bool,
  error: PropTypes.object,
  keypair: PropTypes.object,
  setAccount: PropTypes.func.isRequired,
  createTestAccount: PropTypes.func.isRequired,
  network: PropTypes.string.isRequired,
  switchNetwork: PropTypes.func.isRequired,
  ...propTypes,
};

export default AccountSelector;
