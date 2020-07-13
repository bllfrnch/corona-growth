import path from 'path';
import nodeExternals from 'webpack-node-externals';

const webpackConfig = {
  entry: {
    createdb: './db/scripts/createdb.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    // filename: '[name].bundle.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'eval-source-map',
};

export default webpackConfig;
