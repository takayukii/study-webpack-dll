const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
    library: 'dll_[name]'
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
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: 'dll_[name]'
    })
  ]
};
