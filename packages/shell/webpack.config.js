const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  // IMPORTANT: async entry — required for Module Federation to initialise
  // shared scope before any imports happen.
  entry: './src/index.ts',

  output: {
    // The shell must know its own public path so remote scripts can be resolved.
    publicPath: 'http://localhost:3000/',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      // Resolve the workspace package directly to its TypeScript source.
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      // No remotes declared here — we load them dynamically at runtime.
      // This is the key to the decoupled architecture: the shell webpack config
      // has zero knowledge of any remote module.
      remotes: {},
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: '^6.0.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
