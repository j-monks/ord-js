const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const { img, dependencies, script, styles } = require("./ord.config");

const DEV_MINER_ID =
  "0ab15e6fde1197ef5afdafa0b69c117e2cea74b7c1edc1ba80b7b0993d016b4ai0";
const DEV_BASE_ENDPOINT = "https://ordinals.com";
const recursionEndpointReplace = [
  {
    search: new RegExp(`${DEV_BASE_ENDPOINT}/r/inscription`, "g"),
    replace: "/r/inscription",
  },
  {
    search: new RegExp(`${DEV_BASE_ENDPOINT}/r/metadata`, "g"),
    replace: "/r/metadata",
  },
  {
    search: new RegExp(`${DEV_BASE_ENDPOINT}/r/blockheight`, "g"),
    replace: "/r/blockheight",
  },
  {
    search: new RegExp(`${DEV_BASE_ENDPOINT}/content`, "g"),
    replace: "/content",
  },
];
const imgReplace = Object.entries(img).map(([key, value]) => ({
  search: new RegExp(`/img/${key}`, "g"),
  replace: `/content/${value}`,
}));
const cssReplace = Object.entries(styles).map(([key, value]) => ({
  search: new RegExp(`/${key}`, "g"),
  replace: `/content/${value}`,
}));
const scriptReplace = Object.entries(script).map(([key, value]) => ({
  search: new RegExp(`/${key}`, "g"),
  replace: `/content/${value}`,
}));
const productionDependencies = Object.values(dependencies)
  .map((id) => `<script src="/content/${id}" type="text/javascript"></script>`)
  .join("");
const productionExternals = Object.keys(dependencies).reduce((acc, item) => {
  acc[item] = item;
  return acc;
}, {});

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
        ...(isProduction
          ? [
              {
                test: /\.html$/,
                loader: "raw-loader",
              },
              {
                test: /\.html|.js$/,
                loader: "string-replace-loader",
                options: {
                  multiple: [
                    ...imgReplace,
                    ...cssReplace,
                    ...scriptReplace,
                    ...recursionEndpointReplace,
                  ],
                },
              },
            ]
          : []),
      ],
    },
    externals: isProduction ? productionExternals : {},
    plugins: [
      ...(isProduction
        ? []
        : [
            new CopyPlugin({
              patterns: [
                {
                  from: path.join(__dirname, "public/img"),
                  to: path.join(__dirname, "dist/img"),
                },
              ],
            }),
          ]),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        template: "./src/views/main.html",
        filename: "index.html",
        dependencies: isProduction ? productionDependencies : "",
      }),
      new MiniCssExtractPlugin({ filename: "styles.css" }),
    ],
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
      minimize: true,
    },
    devServer: {
      hot: true,
      static: {
        directory: path.join(__dirname, "dist"),
      },
      watchFiles: ["public/**/*", "src/**/*"],
      port: 3000,
    },
  };
};
