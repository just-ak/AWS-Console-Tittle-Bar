const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

module.exports = {
  devtool: "source-map",
  mode: 'production',
  entry: {
    preferences: './src/preferences/scripts/preferences.tsx',
    plugin_page: './src/plugin_page/scripts/pluginPage.tsx',
    content_pages: './src/content_pages/scripts/content_pages.tsx',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: (pathData) => {
      const entryName = pathData.chunk.name;
      return `scripts/${entryName}_bundle.js`;
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader',
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false, // Ensures compatibility with EJS
            },
          },
        ],
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
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css', // Separate CSS file per entry
    }),
    new HtmlWebpackPlugin({
      chunks: ['plugin_page'],
      template: 'src/plugin_page/index.ejs',
      filename: 'plugin_page/index.html',
      inject: 'body',
      templateParameters: () => {
        return {
          header: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/header.html'), 'utf8'),
          urlForm: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/urlForm.html'), 'utf8'),
          urlList: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/urlList.html'), 'utf8'),
          groupForm: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/groupForm.html'), 'utf8'),
          footer: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/footer.html'), 'utf8'),
          accountConfig: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/accountConfig.html'), 'utf8'),
          preferences: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/preferences.html'), 'utf8'),
          containers: fs.readFileSync(path.resolve(__dirname, 'src/plugin_page/inc/containers.html'), 'utf8'),

        };
      },
    }),
    new HtmlWebpackPlugin({
      template: 'src/preferences/index.html',
      filename: 'preferences/index.html',
      chunks: ['preferences'],
    }),
    new HtmlWebpackPlugin({
      chunks: ['content_pages'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/coloris/coloris.js', to: 'coloris/coloris.js' },
        { from: 'src/coloris/coloris.css', to: 'coloris/coloris.css' },
        { from: 'src/content_pages/css/content_pages.css', to: 'content_pages.css' },
        { from: 'src/icons', to: 'icons' },
      ],
    }),
  ],
};
