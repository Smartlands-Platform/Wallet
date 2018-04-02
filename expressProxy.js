/* eslint-disable */

const express = require('express');
const path = require('path');
const httpProxy = require('express-http-proxy');

const proxy = process.env.PROXY || null;

const appPath = path.join(__dirname, 'build');

const app = express();
app.set('port', process.env.PORT || 3000);

if (process.env.PROXY) {
  const proxyApi = httpProxy(proxy, {
    forwardPath: (req, res) => '/api' + req.url
  });
  app.use('/api', proxyApi);
}

app.use(express.static(appPath));
app.get('/*', (req, res) => {
  if (req.url === '/builds/mac' || req.url === '/builds/win') {
      getDeskBuild(req.url, res);
      return null;
  }
  res.sendFile(path.join(appPath, 'index.html'))
});

app.listen(app.get('port'), '0.0.0.0', () => console.log(`Server listening on port ${app.get('port')}`));

function getDeskBuild(url, res) {
    const platform = url.substr(url.lastIndexOf('/') + 1);
    let file = path.join(__dirname, `/build_app/${platform}/SmartlandsPlatform.exe`);
    if (platform === 'mac') file = path.join(__dirname, `/build_app/${platform}/SmartlandsPlatform.dmg`);
    res.download(file);
    return null;
}
