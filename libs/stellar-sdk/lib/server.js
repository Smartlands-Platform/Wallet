"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _applyConstructor = function (Constructor, args) { var instance = Object.create(Constructor.prototype); var result = Constructor.apply(instance, args); return result != null && (typeof result == "object" || typeof result == "function") ? result : instance; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _errors = require("./errors");

var NotFoundError = _errors.NotFoundError;
var NetworkError = _errors.NetworkError;
var BadRequestError = _errors.BadRequestError;
var BadResponseError = _errors.BadResponseError;

var AccountCallBuilder = require("./account_call_builder").AccountCallBuilder;

var AccountResponse = require("./account_response").AccountResponse;

var Config = require("./config").Config;

var LedgerCallBuilder = require("./ledger_call_builder").LedgerCallBuilder;

var TransactionCallBuilder = require("./transaction_call_builder").TransactionCallBuilder;

var OperationCallBuilder = require("./operation_call_builder").OperationCallBuilder;

var OfferCallBuilder = require("./offer_call_builder").OfferCallBuilder;

var OrderbookCallBuilder = require("./orderbook_call_builder").OrderbookCallBuilder;

var TradesCallBuilder = require("./trades_call_builder").TradesCallBuilder;

var PathCallBuilder = require("./path_call_builder").PathCallBuilder;

var PaymentCallBuilder = require("./payment_call_builder").PaymentCallBuilder;

var EffectCallBuilder = require("./effect_call_builder").EffectCallBuilder;

var FriendbotBuilder = require("./friendbot_builder").FriendbotBuilder;

var AssetsCallBuilder = require("./assets_call_builder").AssetsCallBuilder;

var TradeAggregationCallBuilder = require("./trade_aggregation_call_builder").TradeAggregationCallBuilder;

var xdr = require("stellar-base").xdr;

var isString = _interopRequire(require("lodash/isString"));

var axios = require("axios");
var toBluebird = require("bluebird").resolve;
var URI = require("urijs");
var URITemplate = require("urijs").URITemplate;

var SUBMIT_TRANSACTION_TIMEOUT = 60 * 1000;

exports.SUBMIT_TRANSACTION_TIMEOUT = SUBMIT_TRANSACTION_TIMEOUT;
/**
 * Server handles the network connection to a [Horizon](https://www.stellar.org/developers/horizon/learn/index.html)
 * instance and exposes an interface for requests to that instance.
 * @constructor
 * @param {string} serverURL Horizon Server URL (ex. `https://horizon-testnet.stellar.org`).
 * @param {object} [opts]
 * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments! You can also use {@link Config} class to set this globally.
 */

var Server = exports.Server = (function () {
    function Server(serverURL) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Server);

        this.serverURL = URI(serverURL);

        var allowHttp = Config.isAllowHttp();
        if (typeof opts.allowHttp !== "undefined") {
            allowHttp = opts.allowHttp;
        }

        if (this.serverURL.protocol() != "https" && !allowHttp) {
            throw new Error("Cannot connect to insecure horizon server");
        }
    }

    _createClass(Server, {
        submitTransaction: {

            /**
             * Submits a transaction to the network.
             * @see [Post Transaction](https://www.stellar.org/developers/horizon/reference/transactions-create.html)
             * @param {Transaction} transaction - The transaction to submit.
             * @returns {Promise} Promise that resolves or rejects with response from horizon.
             */

            value: function submitTransaction(transaction) {
                var tx = encodeURIComponent(transaction.toEnvelope().toXDR().toString("base64"));
                var promise = axios.post(URI(this.serverURL).segment("transactions").toString(), "tx=" + tx, { timeout: SUBMIT_TRANSACTION_TIMEOUT }).then(function (response) {
                    return response.data;
                })["catch"](function (response) {
                    if (response instanceof Error) {
                        return Promise.reject(response);
                    } else {
                        return Promise.reject(new BadResponseError("Transaction submission failed. Server responded: " + response.status + " " + response.statusText, response.data));
                    }
                });
                return toBluebird(promise);
            }
        },
        accounts: {

            /**
             * Returns new {@link AccountCallBuilder} object configured by a current Horizon server configuration.
             * @returns {AccountCallBuilder}
             */

            value: function accounts() {
                return new AccountCallBuilder(URI(this.serverURL));
            }
        },
        ledgers: {

            /**
             * Returns new {@link LedgerCallBuilder} object configured by a current Horizon server configuration.
             * @returns {LedgerCallBuilder}
             */

            value: function ledgers() {
                return new LedgerCallBuilder(URI(this.serverURL));
            }
        },
        transactions: {

            /**
             * Returns new {@link TransactionCallBuilder} object configured by a current Horizon server configuration.
             * @returns {TransactionCallBuilder}
             */

            value: function transactions() {
                return new TransactionCallBuilder(URI(this.serverURL));
            }
        },
        offers: {

            /**
             * People on the Stellar network can make offers to buy or sell assets. This endpoint represents all the offers a particular account makes.
             * Currently this method only supports querying offers for account and should be used like this:
             * ```
             * server.offers('accounts', accountId).call()
             *  .then(function(offers) {
             *    console.log(offers);
             *  });
             * ```
             * @param {string} resource Resource to query offers
             * @param {...string} resourceParams Parameters for selected resource
             * @returns OfferCallBuilder
             */

            value: function offers(resource) {
                for (var _len = arguments.length, resourceParams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    resourceParams[_key - 1] = arguments[_key];
                }

                return _applyConstructor(OfferCallBuilder, [URI(this.serverURL), resource].concat(resourceParams));
            }
        },
        orderbook: {

            /**
             * Returns new {@link OrderbookCallBuilder} object configured by a current Horizon server configuration.
             * @param {Asset} selling Asset being sold
             * @param {Asset} buying Asset being bought
             * @param limit
             * @returns {OrderbookCallBuilder}
             */

            value: function orderbook(selling, buying, limit) {
                return new OrderbookCallBuilder(URI(this.serverURL), selling, buying, limit);
            }
        },
        trades: {

            /**
             * Returns new {@link TradesCallBuilder} object configured by a current Horizon server configuration.
             * @returns {TradesCallBuilder}
             */

            value: function trades() {
                return new TradesCallBuilder(URI(this.serverURL));
            }
        },
        operations: {

            /**
             * Returns new {@link OperationCallBuilder} object configured by a current Horizon server configuration.
             * @returns {OperationCallBuilder}
             */

            value: function operations() {
                return new OperationCallBuilder(URI(this.serverURL));
            }
        },
        paths: {

            /**
             * The Stellar Network allows payments to be made between assets through path payments. A path payment specifies a
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
             * Returns new {@link PathCallBuilder} object configured with the current Horizon server configuration.
             *
             * @param {string} source The sender's account ID. Any returned path will use a source that the sender can hold.
             * @param {string} destination The destination account ID that any returned path should use.
             * @param {Asset} destinationAsset The destination asset.
             * @param {string} destinationAmount The amount, denominated in the destination asset, that any returned path should be able to satisfy.
             * @returns {@link PathCallBuilder}
             */

            value: function paths(source, destination, destinationAsset, destinationAmount) {
                return new PathCallBuilder(URI(this.serverURL), source, destination, destinationAsset, destinationAmount);
            }
        },
        payments: {

            /**
             * Returns new {@link PaymentCallBuilder} object configured with the current Horizon server configuration.
             * @returns {PaymentCallBuilder}
             */

            value: function payments() {
                return new PaymentCallBuilder(URI(this.serverURL));
            }
        },
        effects: {

            /**
             * Returns new {@link EffectCallBuilder} object configured with the current Horizon server configuration.
             * @returns {EffectCallBuilder}
             */

            value: function effects() {
                return new EffectCallBuilder(URI(this.serverURL));
            }
        },
        friendbot: {

            /**
             * Returns new {@link FriendbotBuilder} object configured with the current Horizon server configuration.
             * @returns {FriendbotBuilder}
             * @private
             */

            value: function friendbot(address) {
                return new FriendbotBuilder(URI(this.serverURL), address);
            }
        },
        assets: {

            /**
             * Returns new {@link AssetsCallBuilder} object configured with the current Horizon server configuration.
             * @returns {AssetsCallBuilder}
             */

            value: function assets() {
                return new AssetsCallBuilder(URI(this.serverURL));
            }
        },
        loadAccount: {

            /**
            * Fetches an account's most current state in the ledger and then creates and returns an {@link Account} object.
            * @param {string} accountId - The account to load.
            * @returns {Promise} Returns a promise to the {@link AccountResponse} object with populated sequence number.
            */

            value: function loadAccount(accountId) {
                return this.accounts().accountId(accountId).call().then(function (res) {
                    return new AccountResponse(res);
                });
            }
        },
        tradeAggregation: {

            /**
             * 
             * @param {Asset} base base aseet
             * @param {Asset} counter counter asset
             * @param {long} start_time lower time boundary represented as millis since epoch
             * @param {long} end_time upper time boundary represented as millis since epoch
             * @param {long} resolution segment duration as millis since epoch. *Supported values are 5 minutes (300000), 15 minutes (900000), 1 hour (3600000), 1 day (86400000) and 1 week (604800000).
             * Returns new {@link TradeAggregationCallBuilder} object configured with the current Horizon server configuration.
             * @returns {TradeAggregationCallBuilder}
             */

            value: function tradeAggregation(base, counter, start_time, end_time, resolution) {
                return new TradeAggregationCallBuilder(URI(this.serverURL), base, counter, start_time, end_time, resolution);
            }
        }
    });

    return Server;
})();