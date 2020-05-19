import config from './webpack.config.server.babel';
import chokidar from 'chokidar';
import express from 'express';
import http from 'http';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import api from './server/api';
import { renderApp } from './src/server-renderer';

const compiler = webpack(config);
const app = express();

// Serve hot-reloading bundle to client
app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  })
);
app.use(webpackHotMiddleware(compiler));

// Include server routes as a middleware
app.use(function (req, res, next) {
  api(req, res, next);
});

// Anything else gets passed to the client app's server rendering
app.get('*', function (req, res, next) {
  renderApp(req.path, function (err, page) {
    if (err) return next(err);
    res.send(page);
  });
});

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
// const watcher = chokidar.watch(['server.js', './server']);

// watcher.on('ready', function () {
//   watcher.on('all', function () {
//     console.log('Clearing /server/ module cache from server');
//     Object.keys(require.cache).forEach(function (id) {
//       if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
//     });
//   });
// });

// // Do "hot-reloading" of react stuff on the server
// // Throw away the cached client modules and let them be re-required next time
// compiler.plugin('done', function () {
//   console.log('Clearing /src/ module cache from server');
//   Object.keys(require.cache).forEach(function (id) {
//     if (/[\/\\]src[\/\\]/.test(id)) delete require.cache[id];
//   });
// });

const server = http.createServer(app);
server.listen(4000, 'localhost', function (err) {
  if (err) throw err;

  const addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
