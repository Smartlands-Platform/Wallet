"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var CallBuilder = require("./call_builder").CallBuilder;

var OrderbookCallBuilder = require("./orderbook_call_builder").OrderbookCallBuilder;

var BadRequestError = require("./errors").BadRequestError;

/**
 * Creates a new {@link OfferCallBuilder} pointed to server defined by serverUrl.
 *
 * Do not create this object directly, use {@link Server#offers}.
 * @see [Offers for Account](https://www.stellar.org/developers/horizon/reference/offers-for-account.html)
 * @param {string} serverUrl Horizon server URL.
 * @param {string} resource Resource to query offers
 * @param {...string} resourceParams Parameters for selected resource
 */

var OfferCallBuilder = exports.OfferCallBuilder = (function (_CallBuilder) {
    function OfferCallBuilder(serverUrl, resource) {
        for (var _len = arguments.length, resourceParams = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            resourceParams[_key - 2] = arguments[_key];
        }

        _classCallCheck(this, OfferCallBuilder);

        _get(Object.getPrototypeOf(OfferCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        if (resource === "accounts") {
            this.url.segment([resource].concat(resourceParams, ["offers"]));
        } else {
            throw new BadRequestError("Bad resource specified for offer:", resource);
        }
    }

    _inherits(OfferCallBuilder, _CallBuilder);

    return OfferCallBuilder;
})(CallBuilder);