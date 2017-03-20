const webpack = require('webpack');
const path = require('path');

const config = {
  context: path.resolve(__dirname, '.'),
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'pak'),
    publicPath: '/pak/',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },{
      test: /\.js$/,
      exclude: [/bower_components/, /build/, /dist/, /node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    },{
      test: /\.jsx$/,
      exclude: [/bower_components/, /build/, /dist/, /node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', 'react']
          ]
        }
      }]
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
};

module.exports = config;
