const path = require('path');

module.exports = {
  appPath: path.resolve.bind(path, 'app'),
  buildPath: path.resolve.bind(path, 'build'),
  devtool: path.resolve.bind(path, 'source-map'),
};