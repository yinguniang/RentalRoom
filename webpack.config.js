let path = require("path");
let fs = require("fs");
let lessToJs = require('less-vars-to-js');
let themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './www/css/ant-theme-vars.less'), 'utf8'));

module.exports = {
  mode: "development",
  entry: "./www/src/main",
  // devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "./www/dist"),
    filename: "bundle.js"
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "./www/src")],
        exclude: [path.resolve(__dirname, "./node_modules")],
        loader: "babel-loader",
        options: {
          presets: ["react", ["env", {
            //如果不设置 targets 属性，babel-preset-env 和 babel-preset-latest 效果相同
            "targets": {
              //转码后支持chrome 52
              "chrome": 52,
              //转码后支持的浏览器：市场份额>1%, 最新3个版本，ie版本大于8
              "browsers": ["> 1%", "last 3 versions", "not ie <= 8"]
            }
          }], "stage-1"
          ],
          plugins: ["transform-object-rest-spread", "transform-runtime", ["import", {
            "libraryName": "antd",
            "style": true
          }]]
        }
      },
      {
        test: /\.less$/,
        include: [
          path.resolve(__dirname, "./www/src"),
          path.resolve(__dirname, "./www/css"),
          path.resolve(__dirname, "./node_modules/antd")
        ],
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              modifyVars: themeVariables
            }
          }
        ]
      }
    ]
  }
};