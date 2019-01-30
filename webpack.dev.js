const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: __dirname + '/build',
    filename: 'app.[hash].bundle.js',
    publicPath: '/uniprot/pepvep'
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('/uniprot/pepvep')
    }),
  ],
});
