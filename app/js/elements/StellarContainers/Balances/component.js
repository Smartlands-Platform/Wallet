import React, { PropTypes } from 'react';
import { Form, Dropdown, Table } from 'semantic-ui-react';
import Decimal from 'decimal.js';

import Asset from '../../../components/stellar/Asset';
import Amount from '../../../components/stellar/Amount';
import { validPk, AssetInstance, pageWidth, getHeaderCells } from '../../../helpers/StellarTools';
import '../../../../styles/wallet.scss';

import { get } from 'lodash';

const defaultSLTAccount = {
  asset_code: 'SLT',
  asset_issuer: 'GC7Q4726KHPFK3LNMCSYJZ3YT7A2BFMGKEQYRLLTA2TSODUK3HBK2MOB' //'GCKA6K5PCQ6PNF5RQBF7PQDJWRHO6UOGFMRLK3DYHDOI244V47XKQ4GP',
};

class Balances extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validIssuer: true,
      tickersPrice: [{}],
      selectedCell: this.headerTitles.AMOUNT,
    };

    this.getMoviesFromApiAsync();
  }

  get headerTitles() {
    return {
      ASSET: 'ASSET',
      AMOUNT: 'AMOUNT',
      PRICE: 'PRICE',
      PAYMENT: 'PAYMENT',
      TRUSTLINE: 'TRUSTLINE',
    };
  }

  checkIssuer(e) {
    const destinationAddress = e.target.value;
    this.setState({ validIssuer: validPk(destinationAddress) });
    if (destinationAddress === ''){
      this.setState({ validIssuer: true });
    }
  }

  goToPayment(code) {
    this.props.curTab(1, code);
  }

  getMoviesFromApiAsync() {
    return fetch('https://api.stellarterm.com/v1/ticker.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({tickersPrice: responseJson.assets});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  get getSLTtrustline() {
    return this.props.balances.filter(balance => balance.asset.code === defaultSLTAccount.asset_code && balance.asset.issuer === defaultSLTAccount.asset_issuer);
  }

  getBalanceRows() {
    this.props.balances.forEach(balance => {
      this.state.tickersPrice.forEach(asset => {
        if (balance.asset.code === asset.code && asset.issuer == balance.asset.issuer) {
            balance.price_USD = asset.price_USD;
        }
      });
    });

    return this.props.balances.map((balance, index) => {
      const bnBalance = new Decimal(balance.balance);
      const codeText = 'Send ' + get(balance, 'asset.code', '');

      return (
        <Table.Row key={index}>
          <Table.Cell className="prime">
            <Asset {...balance} />
          </Table.Cell>
          { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell className="cell-1">
            <Amount amount={balance.balance} />
          </Table.Cell> : null }
          { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell className="cell-2">
            {this.getPriceUSD(balance.price_USD)}
          </Table.Cell> : null }
          { this.state.selectedCell === this.headerTitles.PAYMENT || pageWidth() ? <Table.Cell className="cell-3">
            <button
              type="button"
              className='btn green-white send-button'
              onClick={this.goToPayment.bind(this, get(balance, 'asset.code', ''))}
            >{codeText}</button>
          </Table.Cell> : null }
          { this.state.selectedCell === this.headerTitles.TRUSTLINE || pageWidth() ? <Table.Cell className="cell-3">
            {this.props.canSign ?
              <button
                className="btn-icon remove"
                data-hover="Remove"
                disabled={!bnBalance.isZero()}
                onClick={() => this.props.deleteTrustline(balance.asset, this.props.balances)}
              />
              : null}
          </Table.Cell> : null }
        </Table.Row>
      );
    });
  }

  getPriceUSD(price) {
    return price ? '$' + price : 'N/A';
  }

  addTrustline(e, { formData }) {
    e.preventDefault();
    this.props.createTrustline(AssetInstance(formData));
  }

  addTrustlineSLT(e) {
    e.preventDefault();
    this.props.createTrustline(AssetInstance(defaultSLTAccount));
  }

  getTrustlineForm() {
    if (!this.props.canSign) {
      return null;
    }
    return (
      <div className='balances-form'>
        <h3>Add a trustline</h3>

        {!this.getSLTtrustline.length && (<button
          type="button"
          className="btn green normal margin-bottom-md"
          onClick={::this.addTrustlineSLT}
          disabled={this.props.creatingTrustline}>
          Add the trustline for SLT
        </button>)}

        <Form
          size='large'
          onSubmit={::this.addTrustline}
          loading={this.props.creatingTrustline}
        >
          <Form.Group>
            <Form.Field
              name="asset_code"
              control="input"
              type="text"
              placeholder="Code"
              width="5"
              maxLength={12}
              required
            />
            <Form.Field
              name="asset_issuer"
              onChange={::this.checkIssuer}
              error={!this.state.validIssuer}
              control="input"
              type="text"
              maxLength={56}
              placeholder="Issuer"
              width="12"
              required
            />
            <Form.Button
              size="big"
              primary
              width="4"
              content="Add trustline"
            />
          </Form.Group>
        </Form>
      </div>
    );
  }

  mobileTableFilter() {
    const changeCell = (e, t) => {
      this.setState({ selectedCell: t.value });
      console.log(this.state);
    };

    return (
      <Dropdown
        className="cell-filter"
        options={getHeaderCells(this.headerTitles)}
        selection
        fluid
        placeholder="Select Cell"
        name="selected_cell"
        value={this.state.selectedCell}
        onChange={changeCell}
      />
    );
  }

  render() {
    return (
      <div className='balances-container'>
        <Table fixed singleLine size="small" compact unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="prime">ASSET</Table.HeaderCell>
              {this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>AMOUNT</Table.HeaderCell> : null}
              {this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>PRICE</Table.HeaderCell> : null}
              {this.state.selectedCell === this.headerTitles.PAYMENT || pageWidth() ? <Table.HeaderCell>PAYMENT</Table.HeaderCell> : null}
              {this.state.selectedCell === this.headerTitles.TRUSTLINE || pageWidth() ? <Table.HeaderCell>TRUSTLINE</Table.HeaderCell> : null}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.tickersPrice.length ? this.getBalanceRows() : null}
          </Table.Body>
        </Table>
        {this.getTrustlineForm()}
        {!pageWidth() ? this.mobileTableFilter() : null}
      </div>
    );
  }
}

Balances.propTypes = {
  canSign: PropTypes.bool.isRequired,
  creatingTrustline: PropTypes.bool,
  balances: PropTypes.array.isRequired,
  createTrustline: PropTypes.func.isRequired,
  deleteTrustline: PropTypes.func.isRequired,
  curTab: PropTypes.func,
};

export default Balances;
