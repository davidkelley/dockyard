module.exports = {
  entry: [
    'babel-polyfill',
    './handler.js'
  ],
  target: 'node',
  externals: {
    // 'aws-sdk': 'aws-sdk'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: __dirname,
        exclude: /node_modules/,
      }
    ]
  },
  node: {
    console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
