const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    publicPath: 'auto',
  },
  experiments: {
    moduleFederation: {
      name: 'myApp',
      remotes: {
        'remoteApp': 'remoteApp@http://localhost:3002/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
