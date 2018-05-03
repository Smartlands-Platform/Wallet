"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

/**
 * Creates a new {@link TradesCallBuilder} pointed to server defined by serverUrl.
 *
 * Do not create this object directly, use {@link Server#trades}.
 * @see [Trades](https://www.stellar.org/developers/horizon/reference/endpoints/trades.html)
 * @param {string} serverUrl serverUrl Horizon server URL.
 */

var TradesCallBuilder = exports.TradesCallBuilder = (function (_CallBuilder) {
    function TradesCallBuilder(serverUrl) {
        _classCallCheck(this, TradesCallBuilder);

        _get(Object.getPrototypeOf(TradesCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("trades");
    }

    _inherits(TradesCallBuilder, _CallBuilder);

    _createClass(TradesCallBuilder, {
        forAssetPair: {

            /**
            * Filter trades for a specific asset pair (orderbook)
            * @param {Asset} base asset
            * @param {Asset} counter asset
            * @returns {TradesCallBuilder}
            */

            value: function forAssetPair(base, counter) {
                if (!base.isNative()) {
                    this.url.addQuery("base_asset_type", base.getAssetType());
                    this.url.addQuery("base_asset_code", base.getCode());
                    this.url.addQuery("base_asset_issuer", base.getIssuer());
                } else {
                    this.url.addQuery("base_asset_type", "native");
                }
                if (!counter.isNative()) {
                    this.url.addQuery("counter_asset_type", counter.getAssetType());
                    this.url.addQuery("counter_asset_code", counter.getCode());
                    this.url.addQuery("counter_asset_issuer", counter.getIssuer());
                } else {
                    this.url.addQuery("counter_asset_type", "native");
                }
                return this;
            }
        },
        forOffer: {

            /**
            * Filter trades for a specific offer
            * @param offerId
            * @returns {TradesCallBuilder}
            */

            value: function forOffer(offerId) {
                this.url.addQuery("offer_id", offerId);
                return this;
            }
        }
    });

    return TradesCallBuilder;
})(CallBuilder);