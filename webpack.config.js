const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.ts", // Your entry TypeScript file
  output: {
    filename: "bundle.js", // The output filename
    path: path.resolve(__dirname, "dist"), // The directory where Webpack will output bundled files
    clean: true, // Clean the output directory before every build (optional)
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Match .ts files
        use: "ts-loader", // Use ts-loader to compile TypeScript
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve both TypeScript and JavaScript files
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Serve files from the 'dist' folder
    },
    open: true, // Automatically open the browser
    port: 8080, // Port to run the dev server on
    hot: true, // Enable Hot Module Replacement (optional)
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html", // Use your custom index.html as template
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  mode: "development", // Development mode
};
