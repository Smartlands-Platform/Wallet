"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var axios = _interopRequire(require("axios"));

var URI = _interopRequire(require("urijs"));

var Promise = _interopRequire(require("bluebird"));

var isString = _interopRequire(require("lodash/isString"));

var pick = _interopRequire(require("lodash/pick"));

var Config = require("./config").Config;

var _stellarBase = require("stellar-base");

var Account = _stellarBase.Account;
var StrKey = _stellarBase.StrKey;

var BadResponseError = require("./errors").BadResponseError;

var StellarTomlResolver = require("./stellar_toml_resolver").StellarTomlResolver;

// FEDERATION_RESPONSE_MAX_SIZE is the maximum size of response from a federation server
var FEDERATION_RESPONSE_MAX_SIZE = 100 * 1024;

exports.FEDERATION_RESPONSE_MAX_SIZE = FEDERATION_RESPONSE_MAX_SIZE;
/**
 * FederationServer handles a network connection to a
 * [federation server](https://www.stellar.org/developers/learn/concepts/federation.html)
 * instance and exposes an interface for requests to that instance.
 * @constructor
 * @param {string} serverURL The federation server URL (ex. `https://acme.com/federation`).
 * @param {string} domain Domain this server represents
 * @param {object} [opts]
 * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments! You can also use {@link Config} class to set this globally.
 */

var FederationServer = exports.FederationServer = (function () {
  function FederationServer(serverURL, domain) {
    var opts = arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, FederationServer);

    // TODO `domain` regexp
    this.serverURL = URI(serverURL);
    this.domain = domain;

    var allowHttp = Config.isAllowHttp();
    if (typeof opts.allowHttp !== "undefined") {
      allowHttp = opts.allowHttp;
    }

    if (this.serverURL.protocol() != "https" && !allowHttp) {
      throw new Error("Cannot connect to insecure federation server");
    }
  }

  _createClass(FederationServer, {
    resolveAddress: {

      /**
       * Returns a Promise that resolves to federation record if the user was found for a given Stellar address.
       * @see <a href="https://www.stellar.org/developers/learn/concepts/federation.html" target="_blank">Federation doc</a>
       * @param {string} address Stellar address (ex. `bob*stellar.org`). If `FederationServer` was instantiated with `domain` param only username (ex. `bob`) can be passed.
       * @returns {Promise}
       */

      value: function resolveAddress(address) {
        if (address.indexOf("*") < 0) {
          if (!this.domain) {
            return Promise.reject(new Error("Unknown domain. Make sure `address` contains a domain (ex. `bob*stellar.org`) or pass `domain` parameter when instantiating the server object."));
          }
          address = "" + address + "*" + this.domain;
        }
        var url = this.serverURL.query({ type: "name", q: address });
        return this._sendRequest(url);
      }
    },
    resolveAccountId: {

      /**
       * Returns a Promise that resolves to federation record if the user was found for a given account ID.
       * @see <a href="https://www.stellar.org/developers/learn/concepts/federation.html" target="_blank">Federation doc</a>
       * @param {string} accountId Account ID (ex. `GBYNR2QJXLBCBTRN44MRORCMI4YO7FZPFBCNOKTOBCAAFC7KC3LNPRYS`)
       * @returns {Promise}
       */

      value: function resolveAccountId(accountId) {
        var url = this.serverURL.query({ type: "id", q: accountId });
        return this._sendRequest(url);
      }
    },
    resolveTransactionId: {

      /**
       * Returns a Promise that resolves to federation record if the sender of the transaction was found for a given transaction ID.
       * @see <a href="https://www.stellar.org/developers/learn/concepts/federation.html" target="_blank">Federation doc</a>
       * @param {string} transactionId Transaction ID (ex. `3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889`)
       * @returns {Promise}
       */

      value: function resolveTransactionId(transactionId) {
        var url = this.serverURL.query({ type: "txid", q: transactionId });
        return this._sendRequest(url);
      }
    },
    _sendRequest: {
      value: function _sendRequest(url) {
        return axios.get(url.toString(), { maxContentLength: FEDERATION_RESPONSE_MAX_SIZE }).then(function (response) {
          if (typeof response.data.memo != "undefined" && typeof response.data.memo != "string") {
            throw new Error("memo value should be of type string");
          }
          return response.data;
        })["catch"](function (response) {
          if (response instanceof Error) {
            if (response.message.match(/^maxContentLength size/)) {
              throw new Error("federation response exceeds allowed size of " + FEDERATION_RESPONSE_MAX_SIZE);
            } else {
              return Promise.reject(response);
            }
          } else {
            return Promise.reject(new BadResponseError("Server query failed. Server responded: " + response.status + " " + response.statusText, response.data));
          }
        });
      }
    }
  }, {
    resolve: {

      /**
       * This method is a helper method for handling user inputs that contain `destination` value.
       * It accepts two types of values:
       *
       * * For Stellar address (ex. `bob*stellar.org`) it splits Stellar address and then tries to find information about
       * federation server in `stellar.toml` file for a given domain. It returns a `Promise` which resolves if federation
       * server exists and user has been found and rejects in all other cases.
       * * For Account ID (ex. `GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS`) it returns a `Promise` which
       * resolves if Account ID is valid and rejects in all other cases. Please note that this method does not check
       * if the account actually exists in a ledger.
       *
       * Example:
       * ```js
       * StellarSdk.FederationServer.resolve('bob*stellar.org')
       *  .then(federationRecord => {
       *    // {
       *    //   account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS',
       *    //   memo_type: 'id',
       *    //   memo: 100
       *    // }
       *  });
       * ```
       * It returns a `Promise` that will resolve to a JSON object with following fields:
       * * `account_id` - Account ID of the destination,
       * * `memo_type` (optional) - Memo type that needs to be attached to a transaction,
       * * `memo` (optional) - Memo value that needs to be attached to a transaction.
       *
       * The Promise will reject in case of any errors.
       *
       * @see <a href="https://www.stellar.org/developers/learn/concepts/federation.html" target="_blank">Federation doc</a>
       * @see <a href="https://www.stellar.org/developers/learn/concepts/stellar-toml.html" target="_blank">Stellar.toml doc</a>
       * @param {string} value Stellar Address (ex. `bob*stellar.org`)
       * @param {object} [opts]
       * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
       * @returns {Promise}
       */

      value: function resolve(value) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        // Check if `value` is in account ID format
        if (value.indexOf("*") < 0) {
          if (!StrKey.isValidEd25519PublicKey(value)) {
            return Promise.reject(new Error("Invalid Account ID"));
          } else {
            return Promise.resolve({ account_id: value });
          }
        } else {
          var addressParts = value.split("*");

          var _addressParts = _slicedToArray(addressParts, 2);

          var domain = _addressParts[1];

          if (addressParts.length != 2 || !domain) {
            return Promise.reject(new Error("Invalid Stellar address"));
          }
          return FederationServer.createForDomain(domain, opts).then(function (federationServer) {
            return federationServer.resolveAddress(value);
          });
        }
      }
    },
    createForDomain: {

      /**
       * Creates a `FederationServer` instance based on information from [stellar.toml](https://www.stellar.org/developers/learn/concepts/stellar-toml.html) file for a given domain.
       * Returns a `Promise` that resolves to a `FederationServer` object. If `stellar.toml` file does not exist for a given domain or it does not contain information about a federation server Promise will reject.
       * ```js
       * StellarSdk.FederationServer.createForDomain('acme.com')
       *   .then(federationServer => {
       *     // federationServer.forAddress('bob').then(...)
       *   })
       *   .catch(error => {
       *     // stellar.toml does not exist or it does not contain information about federation server.
       *   });
       * ```
       * @see <a href="https://www.stellar.org/developers/learn/concepts/stellar-toml.html" target="_blank">Stellar.toml doc</a>
       * @param {string} domain Domain to get federation server for
       * @param {object} [opts]
       * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
       * @returns {Promise}
       */

      value: function createForDomain(domain) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        return StellarTomlResolver.resolve(domain).then(function (tomlObject) {
          if (!tomlObject.FEDERATION_SERVER) {
            return Promise.reject(new Error("stellar.toml does not contain FEDERATION_SERVER field"));
          }
          return new FederationServer(tomlObject.FEDERATION_SERVER, domain, opts);
        });
      }
    }
  });

  return FederationServer;
})();