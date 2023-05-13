const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// console.log('环境变量 ', process.env)

module.exports = {
  mode: 'none',
  // devtool: 'eval-cheap-module-source-map',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // publicPath: './dist/',
    // chunkFilename: '[chunkhash].js',
  },
  devServer: {
    port: 8888,
    // open: true,
    hot: true
  },
  module: {
    rules: [{
      test: /\.(scss|css)$/,
      // use: ['style-loader', 'css-loader']
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }, {
      test: /\.(jpg|png|jpeg)$/,
      type: 'asset/resource'
      // use: {
      //   loader: 'file-loader',
      //   // options: {
      //   //   esModule: false
      //   // },
      // },
      // type: 'javascript/auto'
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      isMe: "'YES'",
      env: JSON.stringify('development')
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
      chunkFilename: '[id].css'
    })
  ]
}