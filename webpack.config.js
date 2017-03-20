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
          presets: ['es2015', 'react']
        }
      }]
    },{
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      use: ['file-loader']
    },{
      test: /\.(woff|woff2)$/,
      use: [{
        loader: 'url-loader',
        options: {
          prefix: 'font',
          limit: 5000
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
    }
  ]
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
};

module.exports = config;
