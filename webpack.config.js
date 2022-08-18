const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
  entry: "./src/index.js",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].bundle.js",
    publicPath: "/",
  },
  devServer: { static: "./dist" },
  plugins: [],
  module: {
    rules: [],
  },
};

module.exports = (env, argv) => {
  const mode = argv.mode;
  const module = config.module;
  const rules = module.rules;
  const plugins = config.plugins;

  config.mode = mode;

  if (mode === "development") {
    plugins.push(
      new HtmlWebpackPlugin({
        template: `./src/index.html`,
        filename: `index.html`,
        minify: false,
        inject: "body",
        cache: true,
        hash: true,
        base: "/",
      })
    );
  } else {
    plugins.push(
      new HtmlWebpackPlugin({
        template: `./src/index.html`,
        filename: `index.html`,
        minify: true,
        inject: "body",
        cache: true,
        hash: true,
        base: "/",
      })
    );
  }

  plugins.push(
    new CopyPlugin({
      patterns: [{ from: "src/resources", to: "resources" }],
    })
  );

  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  if (mode === "production") {
    plugins.push(new CleanWebpackPlugin());
  }

  rules.push({
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  });

  rules.push({
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
  });

  rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
  });

  rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: "babel-loader",
  });

  if (mode === "development") {
    config.devtool = "inline-source-map";
    config.optimization = {
      runtimeChunk: "single",
    };
  }

  return config;
};
