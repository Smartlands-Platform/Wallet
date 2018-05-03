"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

/**
 * The Stellar Network allows payments to be made across assets through path payments. A path payment specifies a
 * series of assets to route a payment through, from source asset (the asset debited from the payer) to destination
 * asset (the asset credited to the payee).
 *
 * A path search is specified using:
 *
 * * The destination address
 * * The source address
 * * The asset and amount that the destination account should receive
 *
 * As part of the search, horizon will load a list of assets available to the source address and will find any
 * payment paths from those source assets to the desired destination asset. The search's amount parameter will be
 * used to determine if there a given path can satisfy a payment of the desired amount.
 *
 * Do not create this object directly, use {@link Server#paths}.
 * @see [Find Payment Paths](https://www.stellar.org/developers/horizon/reference/path-finding.html)
 * @param {string} serverUrl Horizon server URL.
 * @param {string} source The sender's account ID. Any returned path must use a source that the sender can hold.
 * @param {string} destination The destination account ID that any returned path should use.
 * @param {Asset} destinationAsset The destination asset.
 * @param {string} destinationAmount The amount, denominated in the destination asset, that any returned path should be able to satisfy.
 */

var PathCallBuilder = exports.PathCallBuilder = (function (_CallBuilder) {
    function PathCallBuilder(serverUrl, source, destination, destinationAsset, destinationAmount) {
        _classCallCheck(this, PathCallBuilder);

        _get(Object.getPrototypeOf(PathCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("paths");
        this.url.addQuery("destination_account", destination);
        this.url.addQuery("source_account", source);
        this.url.addQuery("destination_amount", destinationAmount);

        if (!destinationAsset.isNative()) {
            this.url.addQuery("destination_asset_type", destinationAsset.getAssetType());
            this.url.addQuery("destination_asset_code", destinationAsset.getCode());
            this.url.addQuery("destination_asset_issuer", destinationAsset.getIssuer());
        } else {
            this.url.addQuery("destination_asset_type", "native");
        }
    }

    _inherits(PathCallBuilder, _CallBuilder);

    return PathCallBuilder;
})(CallBuilder);