const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    polyfill: ['babel-polyfill'],
    vendor: ['react', 'react-dom']
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
    publicPath: '/',
    library: 'dll_[name]'
  },
  devtool: 'source-map',
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
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: 'dll_[name]'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
