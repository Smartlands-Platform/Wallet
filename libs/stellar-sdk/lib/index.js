"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
require("es6-promise").polyfill();

// stellar-sdk classes to expose

_defaults(exports, _interopRequireWildcard(require("./errors")));

exports.Config = require("./config").Config;
exports.Server = require("./server").Server;

var _federation_server = require("./federation_server");

exports.FederationServer = _federation_server.FederationServer;
exports.FEDERATION_RESPONSE_MAX_SIZE = _federation_server.FEDERATION_RESPONSE_MAX_SIZE;

var _stellar_toml_resolver = require("./stellar_toml_resolver");

exports.StellarTomlResolver = _stellar_toml_resolver.StellarTomlResolver;
exports.STELLAR_TOML_MAX_SIZE = _stellar_toml_resolver.STELLAR_TOML_MAX_SIZE;

// expose classes and functions from stellar-base

_defaults(exports, _interopRequireWildcard(require("stellar-base")));

exports["default"] = module.exports;