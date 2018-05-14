import React, { PropTypes } from 'react';
import { Button, Icon, Dropdown, Table } from 'semantic-ui-react';
import moment from 'moment';

import Asset from '../../../components/stellar/Asset';
import AccountId from '../../../components/stellar/AccountId';
import AmountComponent from '../../../components/stellar/Amount';

import { pageWidth, getHeaderCells } from '../../../helpers/StellarTools';

function PaymentArrow({ toMe }) {
  return (
    <div>
      {toMe ? <Icon name="plus" color="green" /> : <Icon name="minus" color="red" />}
    </div>
  );
}
PaymentArrow.propTypes = {
  toMe: PropTypes.bool.isRequired,
};

class Payments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCell: this.headerTitles.ASSET,
    };
  }

  get headerTitles() {
    return {
      AMOUNT: 'AMOUNT',
      ASSET: 'ASSET',
      ACCOUNT: 'ACCOUNT',
      MEMO: 'MEMO',
      DATE: 'DATE',
      OPEN: 'OPEN',
    };
  }

  getDate(transaction) {
    const mo = moment(transaction.created_at);
    return mo.calendar();
  }

  getPaymentRow(payment, index) {
    // console.log("payment", payment);
    const isToMyAccount = this.props.account.account_id === payment.to;
    const externalAccount = isToMyAccount ? payment.from : payment.to;
    const network = this.props.network;
    return (
      <Table.Row key={index} positive={isToMyAccount} negative={!isToMyAccount}>
        <Table.Cell className="inline-block-inside">
          <AmountComponent  amount={payment.amount} accountId={externalAccount} payment={payment} />
          { !pageWidth() ? <PaymentArrow toMe={isToMyAccount} /> : null }
        </Table.Cell>
        { this.state.selectedCell === this.headerTitles.ASSET || pageWidth() ? <Table.Cell className="prime">
          <Asset {...payment} />
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.ACCOUNT || pageWidth() ? <Table.Cell>
          <a className="no-style" href={`/?accountId=${externalAccount}&network=${network}`} target="_blank">
            <AccountId accountId={externalAccount} />
          </a>
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.MEMO || pageWidth() ? <Table.Cell>
          {payment.transaction.memo_type}
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.DATE || pageWidth() ? <Table.Cell>
          {this.getDate(payment.transaction)}
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.OPEN || pageWidth() ? <Table.Cell>
          <button
            className="btn-icon link"
            data-hover="Link"
            onClick={this.openTransaction(payment.transaction)}
          />
        </Table.Cell> : null }
        { pageWidth() ? <Table.Cell>
          <PaymentArrow toMe={isToMyAccount} />
        </Table.Cell> : null }
      </Table.Row>
    );
  }

  getPathPaymentRow(payment, index) {
    const isToMyAccount = this.props.account.account_id === payment.to;
    return (
      <Table.Row key={index} positive={isToMyAccount} negative={!isToMyAccount}>
        <Table.Cell>
          <AmountComponent payment={payment} />
        </Table.Cell>
        <Table.Cell>
          <AccountId accountId={isToMyAccount ? payment.from : payment.to} />
        </Table.Cell>
        <Table.Cell>
          <Asset
            asset_type={payment.source_asset_type}
            asset_issuer={payment.source_asset_issuer}
            asset_code={payment.source_asset_code}
          />
        </Table.Cell>
        <Table.Cell>
          <Asset {...payment} />
        </Table.Cell>
        <Table.Cell>
          {payment.transaction.memo}
        </Table.Cell>
        <Table.Cell>
          {this.getDate(payment.transaction)}
        </Table.Cell>
        <Table.Cell>
          <Button
            circular
            basic
            compact
            icon="external"
            onClick={this.openTransaction(payment.transaction)}
          />
        </Table.Cell>
        <Table.Cell>
          <PaymentArrow toMe={isToMyAccount} />
        </Table.Cell>
      </Table.Row>
    );
  }

  mobileTableFilter() {
    const changeCell = (e, t) => {
      this.setState({ selectedCell: t.value });
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

  openTransaction(transaction) {
    return e => {
      e.preventDefault();
      const id = transaction.id;
      const network = this.props.network;
      const baseUrl = network === 'test' ? 'http://testnet.stellarchain.io/tx/' : 'https://stellarchain.io/tx/';
      const url = `${baseUrl}${id}`;
      window.open(url);
    }
  }

  render() {
    const directPayments = this.props.payments.slice().reverse();
      // console.log("directPayments", directPayments);
    const pathPayments = this.props.pathPayments.slice().reverse();
    const colSpanDefault = pageWidth() ? '6' : '2';

    return (
      <div className="balances-container">
        <Table fixed singleLine size="small"  compact unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>AMOUNT</Table.HeaderCell>
              { this.state.selectedCell === this.headerTitles.ASSET || pageWidth() ? <Table.HeaderCell>ASSET</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.ACCOUNT || pageWidth() ? <Table.HeaderCell>ACCOUNT</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.MEMO || pageWidth() ? <Table.HeaderCell>MEMO</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.DATE || pageWidth() ? <Table.HeaderCell>DATE</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.OPEN || pageWidth() ? <Table.HeaderCell>OPEN</Table.HeaderCell> : null }
              { pageWidth() ? <Table.HeaderCell /> : null }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {directPayments.length ?
              directPayments.map(::this.getPaymentRow)
              :
              <Table.Row>
                <Table.Cell colSpan="6" textAlign="center" >No payments</Table.Cell>
                <Table.Cell />
              </Table.Row>
            }
          </Table.Body>
        </Table>
        {!pageWidth() ? this.mobileTableFilter() : null}
        {/*<Header as="h3">Path payments</Header>*/}
        {/*<Table singleLine size="small" compact unstackable>*/}
          {/*<Table.Header>*/}
            {/*<Table.Row>*/}
              {/*<Table.HeaderCell>AMOUNT</Table.HeaderCell>*/}
              {/*<Table.HeaderCell>ACCOUNT</Table.HeaderCell>*/}
              {/*<Table.HeaderCell>FROM ASSET</Table.HeaderCell>*/}
              {/*<Table.HeaderCell>TO ASSET</Table.HeaderCell>*/}
              {/*<Table.HeaderCell>MEMO</Table.HeaderCell>*/}
              {/*<Table.HeaderCell>DATE</Table.HeaderCell>*/}
              {/*<Table.HeaderCell>OPEN</Table.HeaderCell>*/}
              {/*<Table.HeaderCell />*/}
            {/*</Table.Row>*/}
          {/*</Table.Header>*/}

          {/*<Table.Body>*/}
            {/*{pathPayments.length ?*/}
              {/*pathPayments.map(::this.getPathPaymentRow)*/}
              {/*:*/}
              {/*<Table.Row>*/}
                {/*<Table.Cell colSpan="7" textAlign="center">No path payments</Table.Cell>*/}
                {/*<Table.Cell />*/}
              {/*</Table.Row>*/}
            {/*}*/}
          {/*</Table.Body>*/}
        {/*</Table>*/}
      </div>
    );
  }
}

Payments.propTypes = {
  account: PropTypes.object,
  payments: PropTypes.array,
  pathPayments: PropTypes.array,
  network: PropTypes.string,
};

export default Payments;
