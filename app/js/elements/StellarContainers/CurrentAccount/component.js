import React, { Component, PropTypes } from 'react';
import { Table, Container} from 'semantic-ui-react';
import Clipboard from 'clipboard';

import '../../../../styles/current_account.scss';

class CurrentAccount extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showString: props.showString || false,
      showButton: props.showButton || false,
      showSeed: props.showSeed || false,
      windowWidth: 2,
    };
  }

  componentDidMount() {
    new Clipboard('.account-address-copy'); // eslint-disable-line no-new
    this.checkPageSize();
    window.addEventListener('resize', ::this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.handleResize)
  }

  handleResize() {
    this.checkPageSize();
  }

  openOnNewTab() {
    let url = '/?';
    url += `network=${this.props.network}`;
    if (this.props.keypair.canSign()) {
      url += `&secretSeed=${this.props.keypair.secret()}`;
    } else {
      url += `&accountId=${this.props.keypair.publicKey()}`;
    }
    window.open(url);
  }

  getAccountIdText(issuer) {
    const firstThree = issuer.slice(0, 16);
    const lastThree = issuer.slice(-5);

    return `${firstThree}...${lastThree}`;
  }

  checkPageSize() {
    this.setState({windowWidth: window.innerWidth});
  }

  accountInfo() {
    if (!this.props.keypair) { return null; }

    const { keypair } = this.props;
    const canSign = keypair.canSign();
    return (
      <div>
        <div className="wallet-address-box">
          <h3 className="wallet-address">Wallet address</h3>
          {
            this.props.showString &&
            <h3 className="as-block note-title">
              Save Private key securely before transferring any funds to the account!
            </h3>
          }
          {
            !this.state.showButton && (this.state.showSeed ?
              <button
                type="button"
                className="btn option-btn green-white"
                onClick={() => this.setState({ showSeed: false })}>
                Hide private key
              </button>
              :
              <button
                type="button"
                className="btn option-btn green-white"
                onClick={() => this.setState({ showSeed: true })}>
                Show private key
              </button>)
          }
        </div>
        <Table className='keys-table' compact>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell>
                Public key:
              </Table.HeaderCell>
              <Table.Cell>
                {this.state.windowWidth < 601 ? this.getAccountIdText(keypair.publicKey()) : keypair.publicKey()}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <button
                  type="button"
                  className="btn-icon account-address-copy"
                  size="mini"
                  data-clipboard-text={keypair.publicKey()}
                  data-hover="Copy"
                />
              </Table.Cell>
            </Table.Row>
            {
              canSign && this.state.showSeed &&
              <Table.Row>
                <Table.HeaderCell>
                  Private key:
                </Table.HeaderCell>
                <Table.Cell>
                  {this.state.windowWidth < 601 ? this.getAccountIdText(keypair.secret()) : keypair.secret() }
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <button
                    type="button"
                    className="btn-icon account-address-copy"
                    size="mini"
                    data-clipboard-text={keypair.secret()}
                    data-hover="Copy"
                  />
                </Table.Cell>
              </Table.Row>
            }
          </Table.Body>
        </Table>
      </div>
    );
  }
  render() {
    return (
      <div>
        <Container>
          {this.accountInfo()}
        </Container>
      </div>
    );
  }
}

CurrentAccount.propTypes = {
  keypair: PropTypes.object.isRequired,
  network: PropTypes.string.isRequired,
  openExternal: PropTypes.bool,
  showSeed: PropTypes.bool,
  showButton: PropTypes.bool,
  showString: PropTypes.bool,
};

export default CurrentAccount;
