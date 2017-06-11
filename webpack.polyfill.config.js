const webpack = require('webpack');

module.exports = {
  entry: {
    polyfill: [
      'babel-polyfill'
    ]
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfill',
      minChunks: Infinity,
    })
  ]
};
