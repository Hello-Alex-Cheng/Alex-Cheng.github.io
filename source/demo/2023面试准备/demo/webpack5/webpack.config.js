const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WebpackCopyPlugin = require('./plugins/webpack-copy-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")

// const smp = new SpeedMeasurePlugin()

// console.log('环境变量 ', process.env)

module.exports = {
  mode: 'none',
  devtool: 'eval-cheap-module-source-map',
  // devtool: 'source-map',
  cache: {
    type: 'filesystem'
  },
  entry: {
    main: './index.js',
    another: './another-module.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // publicPath: './dist/',
    chunkFilename: '[name]-[chunkhash].js',
  },
  devServer: {
    port: 8888,
    // open: true,
    hot: true
  },
  optimization: {
    minimize: true, // 开发环境下启用 JS、CSS 优化
    minimizer: [new TerserWebpackPlugin({
      minify: TerserWebpackPlugin.swcMinify, // 使用 swc 压缩代码，需要安装 @swc/core 包
      terserOptions: {}
    }), new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
        },
      },
      chunks: 'all'
    },
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
      ],
      exclude: /node_modules/,
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
    }, {
      test: /\.txt/,
      type: 'asset/source'
    }, {
      test: /\.me/,
      use: [
        {
          loader: './loaders/log.js',
          options: {
            canLog: true
          }
        },
        {
          loader: './loaders/transform-to-uppercase.js',
          options: {
            toUpperCase: true,
          }
        },
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      isMe: "'YES'",
      env: JSON.stringify('development'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
      chunkFilename: '[id].css'
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'disabled', // 禁用模式
    //   generateStatsFile: false, // 设置为 true 来使用这个插件生成 Webpack Stats JSON 文件。
    // })
    new WebpackCopyPlugin({
      copy: true
    })
  ]
}