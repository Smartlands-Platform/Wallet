import React, { PropTypes } from 'react';
import Stellar from 'stellar-sdk';
import { Popup, Button } from 'semantic-ui-react';
import Clipboard from 'clipboard';

const style = { display: 'inline' };

const styles = {
  asset_issuer: {
    color: 'grey',
    padding: '0 0.5rem',
  },
  asset_code: {
    fontWeight: 500,
  },
};

class Asset extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 1,
    };
  }
  componentDidMount() {
    new Clipboard('.asset-address-copy'); // eslint-disable-line no-new
    this.checkPageSize();
    window.addEventListener('resize', ::this.checkPageSize);
  }

  checkPageSize() {
    this.setState({windowWidth: window.innerWidth});
  }

  getAccountIdText(issuer) {
    const firstThree = issuer.slice(0, 16);
    const lastThree = issuer.slice(-5);

    return `${firstThree}...${lastThree}`;
  }

  render() {
    const { asset, asset_type, asset_code, asset_issuer } = this.props;
    if (!asset && !asset_type) {
      return null;
    }
    let objAsset = asset;
    if (!objAsset) {
      if (asset_type === 'native') {
        objAsset = Stellar.Asset.native();
      } else {
        objAsset = new Stellar.Asset(asset_code, asset_issuer);
      }
    }
    if (objAsset.isNative()) {
      return <div style={style}>XLM</div>;
    }

    return (
      <Popup className="popup-box"
        hoverable
        trigger={
          <div style={style}>
            <span style={styles.asset_code}>{objAsset.getCode()}</span>
            <span style={styles.asset_issuer}>({Asset.getIssuerText(objAsset.getIssuer())})</span>
          </div>
        }
      >
        <Popup.Header>
          <p>{objAsset.getCode()}</p>
          <div className="flex-box">
            <span>{this.state.windowWidth < 768 ? this.getAccountIdText(objAsset.getIssuer()) : objAsset.getIssuer()}</span>
            <button
              type="button"
              className="btn-icon account-address-copy"
              size="mini"
              data-clipboard-text={objAsset.getIssuer()}
              data-hover="Copy"
            />
          </div>
        </Popup.Header>
      </Popup>
    );
  }
}

Asset.getIssuerText = (issuer) => {
  const firstThree = issuer.slice(0, 3);
  const lastThree = issuer.slice(-3);
  return `${firstThree}...${lastThree}`;
};

Asset.getAssetString = asset => (
  asset.isNative() ? 'XLM' :
    `${asset.getCode()} (${Asset.getIssuerText(asset.getIssuer())})`
);

Asset.propTypes = {
  asset: PropTypes.object,
  asset_type: PropTypes.string,
  asset_code: PropTypes.string,
  asset_issuer: PropTypes.string,
};

export default Asset;
