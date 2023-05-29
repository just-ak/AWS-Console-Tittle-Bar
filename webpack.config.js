const path = require('path');
//const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    preferences: './src/content/preferences.ts',
    plugin_page: './src/content/plugin_page.ts',
    content_pages: './src/content/content_pages.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: (pathData) => {
      const entryName = pathData.chunk.name;
      return `content/${entryName}_bundle.js`;
    },
  },
  optimization: {
    minimize: false,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: 'html-loader',
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
    ],
  },
  resolve: {
    alias: {
      browser: path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.tJs', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/content/plugin_page.html',
      filename: 'content/plugin_page.html',
      chunks: ['plugin_page'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/content/preferences.html',
      filename: 'content/preferences.html',
      chunks: ['preferences'],
    }),
    new HtmlWebpackPlugin({
      chunks: ['content_pages'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/content/content_pages.css', to: 'content/content_pages.css' },
        { from: 'src/icons', to: 'icons' },
      ],
    }),
  ],
};
