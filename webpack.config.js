const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    // options: './src/options.ts',
    // popup:'./src/popup/choose_page.ts',
    // banner: './src/banner.ts',
  },
  output: {
    // iife: false,
    // // globalObject: 'this',
    // libraryTarget: 'global', // or 'global' or 'commonjs2' or window
    // path: path.resolve(__dirname, 'dist'),
    // filename: (pathData) => {
    //   if (pathData.chunk.name === 'options') {
    //     return 'options.js';
    //   } else if (pathData.chunk.name === 'banner') {
    //     return 'banner.js';
    //   } else if (pathData.chunk.name === 'popup') {
    //     return 'popup/choose_page.js';
    //   } else {
    //     return '[name]/[name].js';
    //   }
    // },
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images',
          publicPath: 'images',
        },
      },
    ]
  },
  resolve: {
    alias: {
      browser: path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.tJs', '.js']
  },

  //devtool: 'source-map',
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: 'src/options.html',
    //   filename: 'options.html',
    //   chunks: ['options']
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/options.html', to: 'options.html' },
        { from: 'src/awsconsolestyle.css', to: 'awsconsolestyle.css' },
        { from: 'src/icons', to: 'icons' },
        { from: 'src/popup/*.html', to:'popup/[name][ext]' },
        { from: 'src/popup/*.css', to:'popup/[name][ext]' },
      ]
    })
  ]
};
