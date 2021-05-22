const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = (env) => {
  console.log('Environment:', env.production ? 'production' : 'development');

  /** @type {import('webpack').Configuration} */
  const config = {
    mode: env.production ? 'production' : 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
      }),
    ],
  };

  return config;
};
