
const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  context: __dirname,
  devtool: 'inline-sourcemap',
  entry: __dirname + '/src/ui/index.jsx',
  output: {
    path: __dirname + '/build',
    filename: 'app.[hash].bundle.js'
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: { minimize: true }
        }]
      }
    ]
  },
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
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    host: 'localhost',
    port: 39093,
  }
};