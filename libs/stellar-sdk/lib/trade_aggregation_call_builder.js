"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var _errors = require("./errors");

var NotFoundError = _errors.NotFoundError;
var NetworkError = _errors.NetworkError;
var BadRequestError = _errors.BadRequestError;

var allowedResolutions = [300000, 900000, 3600000, 86400000, 604800000];

/**
 * Trade Aggregations facilitate efficient gathering of historical trade data
 * Do not create this object directly, use {@link Server#tradeAggregation}.
 * @param {string} serverUrl serverUrl Horizon server URL.
 * @param {Asset} base base asset
 * @param {Asset} counter counter asset
 * @param {long} start_time lower time boundary represented as millis since epoch
 * @param {long} end_time upper time boundary represented as millis since epoch
 * @param {long} resolution segment duration as millis since epoch. *Supported values are 5 minutes (300000), 15 minutes (900000), 1 hour (3600000), 1 day (86400000) and 1 week (604800000).
 * @returns {OrderbookCallBuilder}
 */

var TradeAggregationCallBuilder = exports.TradeAggregationCallBuilder = (function (_CallBuilder) {
    function TradeAggregationCallBuilder(serverUrl, base, counter, start_time, end_time, resolution) {
        _classCallCheck(this, TradeAggregationCallBuilder);

        _get(Object.getPrototypeOf(TradeAggregationCallBuilder.prototype), "constructor", this).call(this, serverUrl);

        this.url.segment("trade_aggregations");
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
        if (typeof start_time === "undefined" || typeof end_time === "undefined") {
            throw new BadRequestError("Invalid time bounds", [start_time, end_time]);
        } else {
            this.url.addQuery("start_time", start_time);
            this.url.addQuery("end_time", end_time);
        }
        if (!this.isValidResolution(resolution)) {
            throw new BadRequestError("Invalid resolution", resolution);
        } else {
            this.url.addQuery("resolution", resolution);
        }
    }

    _inherits(TradeAggregationCallBuilder, _CallBuilder);

    _createClass(TradeAggregationCallBuilder, {
        isValidResolution: {

            /**
             * @private
             * @param {long} resolution 
             */

            value: function isValidResolution(resolution) {
                var found = false;

                for (var i = 0; i < allowedResolutions.length; i++) {
                    if (allowedResolutions[i] == resolution) {
                        found = true;
                        break;
                    }
                }
                return found;
            }
        }
    });

    return TradeAggregationCallBuilder;
})(CallBuilder);