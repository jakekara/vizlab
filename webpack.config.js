const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: {
    "SegmentedBar": "./src/SegmentedBar/index.js",
    "ConnTownMap": "./src/ConnTownMap/index.js",
  },
  output: {
    path: path.resolve("templates"),
    filename: '[name]/js/[name].js',
    library: "viz",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          //          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
} 