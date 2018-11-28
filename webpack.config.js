
const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env, argv) => ({
  context: __dirname,
  devtool: 'inline-sourcemap',
  entry: ['babel-polyfill', __dirname + '/src/ui/index.jsx'],
  output: {
    path: __dirname + '/build',
    filename: 'app.[hash].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: { minimize: true }
      }]
    }, {
      test: /\.(css|sass|scss)$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "sass-loader" // compiles Sass to CSS
      }]
    }]
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
    }),
    new webpack.DefinePlugin({
      BASE_URL: (argv.mode === 'production')
        ? JSON.stringify('http://wp-np2-ca:3687')
        : JSON.stringify('http://localhost:3687')
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