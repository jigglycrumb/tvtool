const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: path.resolve(__dirname, '.'),
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js'
  },
  resolve: {
     extensions: ['.css', '.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },{
      test: /\.jsx?$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-2']
        }
      }]
    },{
      test: /\.swf$/,
      use: ['file-loader']
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      use: ['file-loader']
    },{
      test: /\.(woff|woff2)$/,
      use: [{
        loader: 'url-loader',
        options: {
          prefix: 'font',
          mimetype: "application/font-woff",
          limit: 10000
        }
      }]
    },{
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          mimetype: 'application/octet-stream',
          limit: 10000
        }
      }]
    },{
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          mimetype: 'image/svg+xml',
          limit: 10000
        }
      }]
    },
    {
      test: /\.html$/,
      use: ['html-loader']
    },
  ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

module.exports = config;
