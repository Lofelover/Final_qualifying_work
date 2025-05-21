const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app/index.js',
  output: {
    filename: '[name].bundle.js',
    publicPath: 'auto', // важное для загрузки модулей
  },
  devServer: {
    contentBase: './dist',
    port: 3002,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  experiments: {
    topLevelAwait: true,
    futureDefaults: true,
    moduleFederation: {
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './Cart': './src/components/Cart', // Экспортируем компонент Cart
      },
      shared: ['react', 'react-dom'],
    },
  },
};
