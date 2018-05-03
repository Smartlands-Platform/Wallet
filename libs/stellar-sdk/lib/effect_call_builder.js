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
 * @class EffectCallBuilder
 * @extends CallBuilder
 */

var EffectCallBuilder = exports.EffectCallBuilder = (function (_CallBuilder) {
    /*
     * Creates a new {@link EffectCallBuilder} pointed to server defined by serverUrl.
     *
     * Do not create this object directly, use {@link Server#effects}.
     * @see [All Effects](https://www.stellar.org/developers/horizon/reference/effects-all.html)
     * @constructor
     * @param {string} serverUrl Horizon server URL.
     */

    function EffectCallBuilder(serverUrl) {
        _classCallCheck(this, EffectCallBuilder);

        _get(Object.getPrototypeOf(EffectCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("effects");
    }

    _inherits(EffectCallBuilder, _CallBuilder);

    _createClass(EffectCallBuilder, {
        forAccount: {

            /**
             * This endpoint represents all effects that changed a given account. It will return relevant effects from the creation of the account to the current ledger.
             * @see [Effects for Account](https://www.stellar.org/developers/horizon/reference/effects-for-account.html)
             * @param {string} accountId For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {EffectCallBuilder}
             */

            value: function forAccount(accountId) {
                this.filter.push(["accounts", accountId, "effects"]);
                return this;
            }
        },
        forLedger: {

            /**
             * Effects are the specific ways that the ledger was changed by any operation.
             *
             * This endpoint represents all effects that occurred in the given ledger.
             * @see [Effects for Ledger](https://www.stellar.org/developers/horizon/reference/effects-for-ledger.html)
             * @param {number|string} sequence Ledger sequence
             * @returns {EffectCallBuilder}
             */

            value: function forLedger(sequence) {
                if (typeof sequence == "number") {
                    sequence = sequence.toString();
                }
                this.filter.push(["ledgers", sequence, "effects"]);
                return this;
            }
        },
        forTransaction: {

            /**
             * This endpoint represents all effects that occurred as a result of a given transaction.
             * @see [Effects for Transaction](https://www.stellar.org/developers/horizon/reference/effects-for-transaction.html)
             * @param {string} transactionId Transaction ID
             * @returns {EffectCallBuilder}
             */

            value: function forTransaction(transactionId) {
                this.filter.push(["transactions", transactionId, "effects"]);
                return this;
            }
        },
        forOperation: {

            /**
             * This endpoint represents all effects that occurred as a result of a given operation.
             * @see [Effects for Operation](https://www.stellar.org/developers/horizon/reference/effects-for-operation.html)
             * @param {number} operationId Operation ID
             * @returns {EffectCallBuilder}
             */

            value: function forOperation(operationId) {
                this.filter.push(["operations", operationId, "effects"]);
                return this;
            }
        }
    });

    return EffectCallBuilder;
})(CallBuilder);