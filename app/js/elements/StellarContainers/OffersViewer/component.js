import React, { PropTypes } from 'react';
import { Form, Header, Table, Grid, Dropdown, Icon, Modal, Button } from 'semantic-ui-react';
import Asset from '../../../components/stellar/Asset';
import Amount from '../../../components/stellar/Amount';
import { STROOP, pageWidth, getHeaderCells } from '../../../helpers/StellarTools';

import OrderBook from '../../../elements/StellarContainers/OrderBook';
import {get} from "lodash";

class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCell: this.headerTitles.BUYING,
    };
  }

  get headerTitles() {
    return {
      SELLING: 'Selling',
      BUYING: 'Buying',
      PRICE: 'Price',
      AMOUNT: 'Amount',
      ACTION: 'Action',
    };
  }

  createOffer(e, { formData }) {
    e.preventDefault();

    const selling = this.props.trustlines[formData.sell_asset];
    const buying = this.props.trustlines[formData.buy_asset];

    const offerData = {
      selling,
      buying,
      amount: formData.amount,
      price: formData.price,
      passive: formData.passive,
    };

    this.props.createOffer(offerData);
  }

  deleteOffer(offer) {
    return (e) => {
      e.preventDefault();
      this.props.deleteOffer(offer);
    };
  }


  getOfferRow(offer, index) {
    // console.log('this.state', this.props.offers);
    // if (this.state.selectedSell && this.state.selectedBuy)
    return (
      <Table.Row key={index}>
        <Table.Cell>
          <Asset {...offer.selling} />
        </Table.Cell>
        { this.state.selectedCell === this.headerTitles.BUYING || pageWidth() ? <Table.Cell>
          <Asset {...offer.buying} />
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
          <Amount amount={offer.price} />
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell>
          <Amount amount={offer.amount} />
        </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.ACTION || pageWidth() ? <Table.Cell>
          {this.props.canSign ?
            <button
              className="btn-icon remove"
              data-hover="Remove"
              onClick={::this.deleteOffer(offer)}
            />
            : null}
        </Table.Cell> : null }
      </Table.Row>
    );
  }

  getOfferTable() {
    const colSpanDefault = pageWidth() ? '5' : '2';
    return (
      <div className="is-relative">
        <Table className={this.props.canCreate ? 'exchange-table' : ''} singleLine size="small" compact unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Selling</Table.HeaderCell>
              { this.state.selectedCell === this.headerTitles.BUYING || pageWidth() ? <Table.HeaderCell>Buying</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>Amount</Table.HeaderCell> : null }
              { this.state.selectedCell === this.headerTitles.ACTION || pageWidth() ? <Table.HeaderCell>Action</Table.HeaderCell> : null }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.offers.length ?
              this.props.offers.map(::this.getOfferRow) :
              <Table.Row>
                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">No offers</Table.Cell>
              </Table.Row>
            }
          </Table.Body>
        </Table>
        {!pageWidth() ? this.mobileTableFilter() : null}
      </div>
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

  onChangeSell(e, data) {
    console.log(data);
    const match = e.target.textContent.match(/^(.+?)\(/);
    let selectedSell;
    if (match) {
      selectedSell = match[1];
    } else {
      selectedSell = e.target.textContent;
    }
    this.setState({selectedSell});
  }

  onChangeBuy(e, data) {
    console.log(data);
    const match = e.target.textContent.match(/^(.+?)\(/);
    let selectedBuy;
    if (match) {
      selectedBuy = match[1];
    } else {
      selectedBuy = e.target.textContent;
    }
    this.setState({selectedBuy});
  }

  getOfferForm() {
    const getAssetsOptions = assets => assets.map((asset, index) => (
      {
        value: index,
        text: Asset.getAssetString(asset),
      }));

    return (
      <Form onSubmit={::this.createOffer} loading={this.props.sendingOffer}>
        <Form.Group widths="2">
          <Form.Select
            label="Sell"
            name="sell_asset"
            options={getAssetsOptions(this.props.trustlines)}
            onChange={::this.onChangeSell}
            placeholder="Asset to sell"
            required
          />
          <Form.Select
            label="Buy"
            name="buy_asset"
            options={getAssetsOptions(this.props.trustlines)}
            onChange={::this.onChangeBuy}
            placeholder="Asset to buy"
            required
          />
        </Form.Group>
        <Form.Group widths="2">
          <Form.Field
            name="amount"
            label="Amount"
            control="Input"
            type="number"
            placeholder="0"
            step={STROOP}
            required
          />
          <Form.Field
            name="price"
            label="Price"
            control="Input"
            type="number"
            placeholder="1"
            step={STROOP}
            required
          />
        </Form.Group>
        <Form.Group className="control-box">
          <Form.Checkbox
            name="passive"
            label="Passive offer"
          />
          <Form.Button
            type="submit"
            primary
            className="create-btn"
            color="green"
            content="Create offer"
          />
        </Form.Group>
      </Form>
    );
  }

  render() {
    return (
      <div className="balances-container">
        {this.props.canSign && this.props.canCreate ?
          <div className="exchange-block">
            <Grid columns={2} divided doubling>
              <Grid.Row>
                <Grid.Column className="main-column">
                  <div className="holder">
                    <Header as="h3">Create offer</Header>
                    {this.getOfferForm()}
                    {this.getOfferTable()}
                  </div>
                </Grid.Column>
                <Grid.Column className="main-column">
                  <div className="holder">
                    <OrderBook />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          : null
        }
        {!this.props.canCreate ?
          this.getOfferTable()
          : null
        }
      </div>
    );
  }
}

Offers.propTypes = {
  trustlines: PropTypes.array,
  offers: PropTypes.array,
  createOffer: PropTypes.func.isRequired,
  deleteOffer: PropTypes.func.isRequired,
  canSign: PropTypes.bool,
  sendingOffer: PropTypes.bool,
  canCreate: PropTypes.bool,
};

export default Offers;
