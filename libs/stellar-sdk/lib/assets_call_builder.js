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
 * Creates a new {@link AssetsCallBuilder} pointed to server defined by serverUrl.
 *
 * Do not create this object directly, use {@link Server#assets}.
 * @constructor
 * @extends CallBuilder
 * @param {string} serverUrl Horizon server URL.
 */

var AssetsCallBuilder = exports.AssetsCallBuilder = (function (_CallBuilder) {
    function AssetsCallBuilder(serverUrl) {
        _classCallCheck(this, AssetsCallBuilder);

        _get(Object.getPrototypeOf(AssetsCallBuilder.prototype), "constructor", this).call(this, serverUrl);
        this.url.segment("assets");
    }

    _inherits(AssetsCallBuilder, _CallBuilder);

    _createClass(AssetsCallBuilder, {
        forCode: {

            /**
             * This endpoint filters all assets by the asset code.
             * @param {string} value For example: `USD`
             * @returns {AssetsCallBuilder}
             */

            value: function forCode(value) {
                this.url.addQuery("asset_code", value);
                return this;
            }
        },
        forIssuer: {

            /**
             * This endpoint filters all assets by the asset issuer.
             * @param {string} value For example: `GDGQVOKHW4VEJRU2TETD6DBRKEO5ERCNF353LW5WBFW3JJWQ2BRQ6KDD`
             * @returns {AssetsCallBuilder}
             */

            value: function forIssuer(value) {
                this.url.addQuery("asset_issuer", value);
                return this;
            }
        }
    });

    return AssetsCallBuilder;
})(CallBuilder);