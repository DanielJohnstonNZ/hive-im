const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");

var LiveReloadPlugin = require("webpack-livereload-plugin");

module.exports = {
  context: __dirname,
  entry: {
    main: "./index.tsx",
    vendor: ["react", "react-dom", "webrtc-adapter"]
  },
  devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../webroot")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"]
  },
  module: {
    loaders: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
        options: {
          useBabel: true
        }
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Swarmr",
      template: "./index.html"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor"]
    }),
    new LiveReloadPlugin()
  ]
};
