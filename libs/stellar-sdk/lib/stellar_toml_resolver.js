"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var axios = _interopRequire(require("axios"));

var Promise = _interopRequire(require("bluebird"));

var toml = _interopRequire(require("toml"));

var Config = require("./config").Config;

// STELLAR_TOML_MAX_SIZE is the maximum size of stellar.toml file
var STELLAR_TOML_MAX_SIZE = 100 * 1024;

exports.STELLAR_TOML_MAX_SIZE = STELLAR_TOML_MAX_SIZE;
/**
 * StellarTomlResolver allows resolving `stellar.toml` files.
 */

var StellarTomlResolver = exports.StellarTomlResolver = (function () {
  function StellarTomlResolver() {
    _classCallCheck(this, StellarTomlResolver);
  }

  _createClass(StellarTomlResolver, null, {
    resolve: {
      /**
       * Returns a parsed `stellar.toml` file for a given domain.
       * Returns a `Promise` that resolves to the parsed stellar.toml object. If `stellar.toml` file does not exist for a given domain or is invalid Promise will reject.
       * ```js
       * StellarSdk.StellarTomlResolver.resolve('acme.com')
       *   .then(stellarToml => {
       *     // stellarToml in an object representing domain stellar.toml file.
       *   })
       *   .catch(error => {
       *     // stellar.toml does not exist or is invalid
       *   });
       * ```
       * @see <a href="https://www.stellar.org/developers/learn/concepts/stellar-toml.html" target="_blank">Stellar.toml doc</a>
       * @param {string} domain Domain to get stellar.toml file for
       * @param {object} [opts]
       * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
       * @returns {Promise}
       */

      value: function resolve(domain) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        var allowHttp = Config.isAllowHttp();
        if (typeof opts.allowHttp !== "undefined") {
          allowHttp = opts.allowHttp;
        }

        var protocol = "https";
        if (allowHttp) {
          protocol = "http";
        }
        return axios.get("" + protocol + "://" + domain + "/.well-known/stellar.toml", { maxContentLength: STELLAR_TOML_MAX_SIZE }).then(function (response) {
          try {
            var tomlObject = toml.parse(response.data);
            return Promise.resolve(tomlObject);
          } catch (e) {
            return Promise.reject(new Error("Parsing error on line " + e.line + ", column " + e.column + ": " + e.message));
          }
        })["catch"](function (err) {
          if (err.message.match(/^maxContentLength size/)) {
            throw new Error("stellar.toml file exceeds allowed size of " + STELLAR_TOML_MAX_SIZE);
          } else {
            throw err;
          }
        });
      }
    }
  });

  return StellarTomlResolver;
})();