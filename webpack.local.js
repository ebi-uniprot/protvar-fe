const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: __dirname + '/build',
    filename: 'app.[hash].bundle.js',
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebPackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html'
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3100,
      proxy: 'http://localhost:39093/',
      open: false,
      ui: false
    }, {
      reload: false
    }),
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('http://localhost:3687')
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    host: 'localhost',
    port: 39093,
    historyApiFallback: true
  }
});
