import React, { Component, PropTypes } from 'react';
import { Container, Button, Message, Checkbox } from 'semantic-ui-react';
import Clipboard from 'clipboard';
import { Field, propTypes } from 'redux-form';
import { debounce } from 'lodash';

import * as StellarHelper from '../../../helpers/StellarTools';
import InputFormField from '../../UiTools/SemanticForm/Input';
import KeypairGenerator from '../../../elements/UiTools/KeypairGenerator';
import {downloadDeskBuild} from '../../../helpers/common';

import '../../../../styles/account_selector.scss';

const userAgent = navigator.userAgent.toLowerCase();
const toUpperCase = value => value && value.toUpperCase();

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
  errorMessage: {
    marginLeft: '31px',
    color: 'red',
  },
};

class AccountSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAccept: false,
      keypair: null,
      showSeed: false,
      resolving: false,
    };
     //TODO ACCOUNT: keypair.secret()
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
    // this.props.switchNetwork('test');
    this.props.switchNetwork('public');
    new Clipboard('.account-address-copy'); // eslint-disable-line no-new
  }

  toggleChange = () => {
    this.setState({ isAccept: !this.state.isAccept });
  }

  handleAddress = debounce((e, newAddress) => {
    this.setState({resolving: true});
    const address = newAddress;

    const isSeed = StellarHelper.validSeed(address);
    if (isSeed) {
      const keypair = StellarHelper.KeypairInstance({secretSeed: address});
      this.setState({
        keypair,
        resolving: false,
      });
      return;
    }

    StellarHelper.resolveAddress(address)
      .then((resolved) => {
        const keypair = StellarHelper.KeypairInstance({publicKey: resolved.account_id});
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
  }, 300);

  handleSet(e) {
    e.preventDefault();
    const keypair = this.state.keypair;
    if (!keypair) return;

    // console.log('keypair', keypair)
    this.props.setAccount(keypair);
  }

  blockChars(event){
    if (!((event.charCode >= 48 && event.charCode <= 57) ||
      (event.charCode >= 65 && event.charCode <= 90) ||
      (event.charCode >= 97 && event.charCode <= 122))) {
      event.preventDefault();
    }
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
          type="password"
          maxLength={56}
          placeholder="Enter private key"
          error={!!address && !this.state.keypair}
          onKeyPress={this.blockChars}
          normalize={toUpperCase}
          fluid
          action={{
            color: buttonColor,
            disabled,
            content: buttonContent,
            onClick: ::this.handleSet,
          }}
        />
        {window.innerWidth > 767 && !!address && !this.state.keypair &&
        <span style={styles.errorMessage}>Invalid key. Please check the key and try again.</span>}
      </div>
    );
  }

  render() {
    return (
      <div>
        <Container textAlign="left">
          {this.newForm()}
          <br />
          <Checkbox
            checked={this.state.isAccept}
            onChange={this.toggleChange}
            label={<label className="label-checkbox">
              I accept the
              <a href="https://smartlands.io/pdf/Wallet_Terms_of_Use.pdf" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Terms of Use </a>
              and the
              <a href="https://smartlands.io/pdf/Wallet_Privacy_Policy.pdf" target="_blank" rel="noopener noreferrer" style={styles.link}>
              Privacy Police</a>.
              I understand that Smartlands Wallet does not endorse any asset on
              the Stellar network and I understand risks related to cryptocurrencies.
            </label>}
          />
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
            className="btn big green-white fixed-width"
            content="Generate keypair"
            onClick={this.props.openKeypairModal}
          />
          <br/>
          {/*{ window.innerWidth > 767 && userAgent.indexOf(' electron/') === -1*/}
            {/*? <a onClick={downloadDeskBuild.bind(downloadDeskBuild, 'mac')}>*/}
                {/*<Button className="btn big green-white download-btn" content="Download for Mac"/>*/}
              {/*</a>*/}
            {/*: null }*/}
          {/*{ window.innerWidth > 767 && userAgent.indexOf(' electron/') === -1*/}
            {/*? <a onClick={downloadDeskBuild.bind(downloadDeskBuild, 'win')}>*/}
                {/*<Button  className="btn big green-white download-btn" content="Download for Windows"/>*/}
              {/*</a>*/}
            {/*: null }*/}

          {/*/!*onClick={this.props.openKeypairModal}*!/*/}
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
