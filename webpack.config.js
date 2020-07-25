const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const config = {
  entry: "./server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [new Dotenv()]
};

module.exports = config;