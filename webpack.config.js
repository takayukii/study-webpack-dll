const webpack = require('webpack');

module.exports = {
  entry: {
    index: [
      'babel-polyfill',
      './src/index.jsx'
    ]
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './public',
    port: 8080
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', {
              targets: {
                browsers: ['last 2 versions']
              },
              useBuiltIns: true,
              debug: true
            }],
            'react'
          ],
          plugins: [
            'transform-react-jsx'
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
