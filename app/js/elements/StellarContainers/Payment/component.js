import React, { Component, PropTypes } from 'react';
import { Button, Icon, Dimmer, Loader, Modal, Grid, Header, Dropdown, Form as FormUI } from 'semantic-ui-react';
import { Field, propTypes } from 'redux-form';

import Asset from '../../../components/stellar/Asset';
import { STROOP, KeypairInstance, resolveAddress } from '../../../helpers/StellarTools';
import { OPERATIONS } from '../../../actions-creators/stellar';
import KeypairGenerator from '../../../elements/UiTools/KeypairGenerator';

import DropdownFormField from '../../UiTools/SemanticForm/Dropdown';
import InputFormField from '../../UiTools/SemanticForm/Input';

import { get, isEqual, debounce } from 'lodash';

import '../../../../styles/payment_form.scss';

const styles = {
  padV: {
    margin: '20px auto',
  },
  marginLeft: {
    marginLeft: '60px',
  },
};

// TODO ask send validation
function MemoFields({ memo }) {
  const types = [
    {
      value: 'none',
      text: 'None',
    },
    {
      value: 'text',
      text: 'Text',
    },
    {
      value: 'id',
      text: 'ID',
    },
    {
      value: 'hash',
      text: 'Hash',
    },
    {
      value: 'returnHash',
      text: 'Return Hash',
    },
  ];

  return (
    <div className="memo-box">
      <label>Memo</label>
      <Field
        className="memo-main-field"
        component={DropdownFormField}
        name="memo.type"
        options={types}
        fluid
      />
      <label className="memo-value">Memo value</label>
      <Field
        component={InputFormField}
        name="memo.value"
        type="text"
        placeholder="Memo"
        fluid
        disabled={memo && memo.type === 'none'}
      />
    </div>
  );
}

MemoFields.propTypes = {
  memo: PropTypes.object.isRequired,
};

class Payment extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type: this.setType(props.selectedIndex),
      destinationKeypair: null,
      asset: this.curAsset,
    };

    this.checkDestinationDebounced = debounce(this.checkDestinationDebounced, 200);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.selectedIndex, this.props.selectedIndex)) {
      this.setState({type: this.setType(nextProps.selectedIndex)});
    }
  }

  setType(tabIndex) {
    let type = OPERATIONS.PAYMENT;
    switch (tabIndex) {
      case 5:
        type = OPERATIONS.ISSUE_ASSET;
        break;
      case 6:
        type = OPERATIONS.CREATE_ACCOUNT;
        break;
      default:
        type = OPERATIONS.PAYMENT;
    }

    return type;
  }

  get curAsset() {
    const asset = this.props.curCode;
    const selectedAsset = this.props.trustlines.filter((item, index) => {
      if (item.code.indexOf(asset) !== -1) item.index = index;
      return item.code.indexOf(asset) !== -1;
    });

    return selectedAsset.length ? selectedAsset[0].index : '';
  }

  getPaymentForm() {
    const getAssetsOptions = assets => assets.map((asset, index) => {
      return {
        value: index,
        text: Asset.getAssetString(asset),
      }});

    return (
      <div>
        <FormUI.Field>
          <label>Source asset</label>
          {/*<Field*/}
            {/*component={DropdownFormField}*/}
            {/*name="asset"*/}
            {/*placeholder="Asset to send"*/}
            {/*options={getAssetsOptions(this.props.trustlines)}*/}
            {/*fluid*/}
            {/*required*/}
          {/*/>*/}
          <Dropdown
            options={getAssetsOptions(this.props.trustlines)}
            selection
            fluid
            placeholder="Asset to send"
            name="operation_type"
            value={this.state.asset}
            onChange={(e, t) => this.setState({ asset: t.value })}
            required
          />
        </FormUI.Field>
        <FormUI.Field>
          <label>Amount</label>
          <Field
            component={InputFormField}
            name="amount"
            type="number"
            min={0}
            step={STROOP}
            placeholder="0"
            fluid
            required
          />
        </FormUI.Field>
      </div>
    );
  }

  getPathPaymentForm() {
    const sourceAssets = this.props.trustlines.map((asset, index) => (
      {
        value: index,
        text: Asset.getAssetString(asset),
      }));
    const destAssets = this.state.destinationKeypair ?
      this.props.destinationTruslines.map((asset, index) => (
        {
          value: index,
          text: Asset.getAssetString(asset),
        })) : [];

    return (
      <div>
        <FormUI.Group widths="2">
          <FormUI.Field>
            <label>Source asset</label>
            <Field
              component={DropdownFormField}
              name="asset_source"
              placeholder="Asset to send"
              options={sourceAssets}
              fluid
              required
            />
          </FormUI.Field>
          <FormUI.Field>
            <label>Destination asset</label>
            <Field
              component={DropdownFormField}
              name="asset_destination"
              placeholder="Asset to receive"
              options={destAssets}
              fluid
              required
            />
          </FormUI.Field>
        </FormUI.Group>
        <FormUI.Field>
          <label>Maximum amount to send</label>
          <Field
            component={InputFormField}
            name="max_amount"
            type="number"
            min={0}
            step={STROOP}
            placeholder="0"
            fluid
            required
          />
        </FormUI.Field>
        <FormUI.Field>
          <label>Amount to receive</label>
          <Field
            component={InputFormField}
            name="amount_destination"
            type="number"
            min={0}
            step={STROOP}
            placeholder="0"
            fluid
            required
          />
        </FormUI.Field>
        <MemoFields memo={this.curMemo} />
      </div>
    );
  }

  get curMemo() {
    return this.props.values && this.props.values.memo ? this.props.values.memo : { type: 'none' };
  }

  getIssueForm() {
    return (
      <div>
        <FormUI.Field>
          <label>Code</label>
          <Field
            component={InputFormField}
            name="asset_code"
            type="text"
            placeholder="EUR"
            fluid
            required
          />
        </FormUI.Field>
        <FormUI.Field>
          <label>Amount</label>
          <Field
            component={InputFormField}
            name="amount"
            type="number"
            min={0}
            step={STROOP}
            placeholder="0"
            fluid
            required
          />
        </FormUI.Field>
      </div>
    );
  }

  getCreateAccountForm() {
    return (
      <div>
        <FormUI.Field>
          <label>Starting balance</label>
          <Field
            component={InputFormField}
            name="amount"
            type="number"
            min={0}
            step={STROOP}
            placeholder="0"
            fluid
            required
          />
        </FormUI.Field>
      </div>
    );
  }

  getAccountMergeForm() {
    return null;
  }

  getNoSigner() {
    return (
      <div>
        Cannot make payment with public key.
      </div>
    );
  }

  openConfirmModal() {
    this.setState({ confirmModalOpen: true });
  }
  closeConfirmModal() {
    this.setState({ confirmModalOpen: false });
  }

  submitForm() {
    if (!this.state.destinationKeypair) {
      return Promise.reject();
    }
    // asset: this.state.asset,
    this.closeConfirmModal();
    const enhancedFormData = {
      ...this.props.values,
      destination: this.state.destinationKeypair.publicKey(),
    };
    this.state.type === OPERATIONS.PAYMENT ? Object.assign(enhancedFormData, {asset: this.state.asset}) : {};
    return this.props.sendOperation(this.state.type, enhancedFormData);
  }

  checkDestination(e, destinationAddress) {
    this.setState({ resolving: true });
    this.checkDestinationDebounced(destinationAddress);
  }

  checkDestinationDebounced(destinationAddress) {
    resolveAddress(destinationAddress)
      .then((resolved) => {
        this.props.getDestinationTrustlines(resolved.account_id);

        const { memo_type, memo } = resolved;
        if (memo_type && memo) {
          this.props.change('memo.type', memo_type);
          this.props.change('memo.value', memo);
        }

        this.setState({
          resolving: false,
          destinationKeypair: KeypairInstance({ publicKey: resolved.account_id }),
        });
        return null;
      })
      .catch(() => {
        this.setState({
          resolving: false,
          destinationKeypair: null,
        });
      });
  }

  renderConfirmModal() {
    const destination = get(this.props, 'values.destination', '');

    return (
      <Modal open={this.state.confirmModalOpen} basic size="small">
        <Header icon="archive" content="Comfirm operation" />
        <Modal.Content>
          <p>
            You are going to send a
            <b> {this.state.type} </b>
            operation to ${destination};
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={::this.closeConfirmModal}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" inverted onClick={::this.submitForm}>
            <Icon name="checkmark" /> Ok ?
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  goToPayment() {
    this.props.curTab(6);
  }

  issueTokenControls (props) {
    return (
      <div className="btn-box">
          <button
            type="button"
            className="btn green-white"
            onClick={::this.goToPayment}>
            Create a distributing account
          </button>
          <a
            href="https://smartlands.io/pdf/TokenIssue.pdf"
            className="btn gray">
            How to issue a token guide
          </a>
      </div>
    );
  }

  openKeypairModal(e) {
    e.preventDefault();
    this.props.openKeypairModal();
  }

  InfoBoxCreator() {
    return (
      <div className="info-box">
          <p>Click on “Generator keypair” on the menu bar to get a new couple
            of public and secret key.</p>
      </div>
    );
  }

  get paymentColumnClass() {
    let curClass;

    if (this.state.type === OPERATIONS.PAYMENT) {
      curClass = 'payment-column';
    } else if (this.state.type === OPERATIONS.ISSUE_ASSET) {
      curClass = 'issue-box';
    } else {
      curClass = null;
    }
    return curClass;
  }

  get rowBoxClass() {
    if (this.state.type === OPERATIONS.CREATE_ACCOUNT || this.state.type === OPERATIONS.PAYMENT) {
      return 'row-box';
    }
    return null;
  }

  render() {
    if (!this.props.canSign) return this.getNoSigner();

    const destinationFormLabel = {
      color: this.state.destinationKeypair ? 'teal' : 'red',
      icon: this.state.destinationKeypair ? 'checkmark' : null,
      className: 'iconOnly',
    };

    const isFormValid = this.state.resolving ||
      !this.state.destinationKeypair ||
      this.props.sendingPayment;

    const alignmentButton = this.state.type === OPERATIONS.PAYMENT ? 'text-center' : 'text-left';

    const buttonContent = () => {
      let type;
      switch (this.state.type) {
        case OPERATIONS.ISSUE_ASSET:
          type = 'Issue tokens';
          break;
        case OPERATIONS.CREATE_ACCOUNT:
          type = 'Create account';
          break;
        default:
          type = 'Make payment';
          break;
      }

      return type;
    };

    return (
      <div className={this.setType(this.props.selectedIndex)}>
      <FormUI onSubmit={e => e.preventDefault()} className="payment-form">
        <Dimmer active={this.props.sendingPayment} inverted>
          <Loader>Sending...</Loader>
        </Dimmer>
        <div style={{ height: '1rem' }} />
        <Grid columns={2} divided doubling>
          <Grid.Row className={this.rowBoxClass}>
            <Grid.Column className={this.paymentColumnClass}>
              <FormUI.Field className="grdt-field">
                <label>Destination</label>
                <Field
                  component={InputFormField}
                  name="destination"
                  onChange={::this.checkDestination}
                  placeholder="GRDT... or bob*federation.org"
                  label={!this.state.resolving && destinationFormLabel}
                  labelPosition="right"
                  loading={this.state.resolving}
                  icon={this.state.resolving && 'user'}
                  fluid
                  required
                />
              </FormUI.Field>
              {this.state.type === OPERATIONS.PAYMENT ? this.getPaymentForm() : null}
              {this.state.type === OPERATIONS.PATH_PAYMENT ? this.getPathPaymentForm() : null}
              {this.state.type === OPERATIONS.ISSUE_ASSET ? this.getIssueForm() : null}
              {this.state.type === OPERATIONS.CREATE_ACCOUNT ? this.getCreateAccountForm() : null}
              {this.state.type === OPERATIONS.ACCOUNT_MERGE ? this.getAccountMergeForm() : null}
            </Grid.Column>
            <Grid.Column className={this.paymentColumnClass}>
              {this.state.type === OPERATIONS.PAYMENT ? <MemoFields memo={this.curMemo} /> : null}
              {this.state.type === OPERATIONS.ISSUE_ASSET ? this.issueTokenControls() : null}
              {this.state.type === OPERATIONS.CREATE_ACCOUNT ? this.InfoBoxCreator() : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className={alignmentButton}>
          <Button
            style={styles.padV}
            onClick={::this.openConfirmModal}
            primary
            type="submit"
            className="btn big green main-btn"
            content={buttonContent()}
            disabled={isFormValid}
          />

          {this.state.type === OPERATIONS.CREATE_ACCOUNT ?
            <Button
              style={styles.marginLeft}
              className="btn big green-white generate-key"
              content="Generate keypair"
              onClick={::this.openKeypairModal}
            /> : null
          }
          <KeypairGenerator open={this.props.keypairModalOpen} close={this.props.closeKeypairModal} />
        </div>

        {this.renderConfirmModal()}
      </FormUI>
      </div>
    );
  }
}

Payment.propTypes = {
  sendingPayment: PropTypes.bool,
  sendOperation: PropTypes.func.isRequired,
  getDestinationTrustlines: PropTypes.func.isRequired,
  account: PropTypes.object,
  trustlines: PropTypes.array,
  destinationTruslines: PropTypes.array,
  canSign: PropTypes.bool,
  curCode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  selectedIndex: PropTypes.number,
  curTab: PropTypes.func,
  ...propTypes,
};

export default Payment;
