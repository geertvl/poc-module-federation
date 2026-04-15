const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  output: {
    // Each remote must have its own public path so assets resolve correctly.
    publicPath: 'http://localhost:3001/',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@poc-mf/shell-contracts': path.resolve(__dirname, '../shell-contracts/src/index.ts'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      // Must match the "scope" field in shell-config.json
      name: 'orders',
      // remoteEntry.js is the script the shell will load dynamically
      filename: 'remoteEntry.js',
      exposes: {
        // The manifest is the key exposed entry — this is what the shell loads at boot
        './manifest': './src/manifest.ts',
        // The App is exposed for standalone development and future shell use
        './App': './src/App.tsx',
      },
      shared: {
        // singleton: true ensures only one React instance runs across shell + modules
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  devServer: {
    port: 3001,
    historyApiFallback: true,
    // CORS headers are required so the shell (localhost:3000) can load remoteEntry.js
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
