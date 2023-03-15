const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    options: './src/options.ts',
    popup:'./src/popup/choose_page.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (pathData) => {
      return pathData.chunk.name === 'options' ? 'options.js' : '[name]/[name].js';
    }
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
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/popup/choose_page.html',
      filename: 'choose_page.html',
      chunks: ['choose_page']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' },
        { from: 'src/popup/*.html', to:'popup/[name].[ext]' },
        { from: 'src/popup/*.css', to:'popup/[name].[ext]' },
      ]
    })
  ]
};
