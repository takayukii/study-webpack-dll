const webpack = require('webpack');

module.exports = {
  entry: {
    index: [
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
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dll/polyfill-manifest.json')
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dll/vendor-manifest.json')
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
