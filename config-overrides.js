const path = require('path');
const { override, addBabelPlugins, addBabelPresets, babelInclude, disableEsLint } = require('customize-cra');
const fs = require("fs");

// Toolbar fix for react-native-vector-icons
// https://github.com/oblador/react-native-vector-icons/issues/1104#issuecomment-599393489
(() => {
  const filePath = require.resolve(`react-native-vector-icons/lib/toolbar-android.js`);
  const code = fs.readFileSync(filePath).toString();
  fs.writeFileSync(filePath, code.replace(`import { ToolbarAndroid } from './react-native';`, `import ToolbarAndroid from '@react-native-community/toolbar-android';`));
})();

module.exports = override(
  disableEsLint(),
  ...addBabelPlugins(
    '@babel/plugin-proposal-class-properties',
    "@babel/plugin-proposal-object-rest-spread"),
  ...addBabelPresets([
    "@babel/preset-env", { useBuiltIns: "usage" }],
    "@babel/preset-react",
    "@babel/preset-flow",
    "@babel/preset-typescript"),
  babelInclude([
    path.resolve(__dirname, 'node_modules/react-native-elements'),
    path.resolve(__dirname, 'node_modules/@react-native-community/slider'),
    path.resolve(__dirname, 'node_modules/@react-native-community/datetimepicker'),
    path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
    path.resolve(__dirname, 'node_modules/react-native-ratings'),
    path.resolve(__dirname, 'src'),
  ])
);

// module.exports = function override(config, env) {
//   config.module.rules.push({
//     test: /\.js$/,
//     exclude: /node_modules[/\\](?!react-native-vector-icons|react-native-safe-area-view)/,
//     use: {
//       loader: "babel-loader",
//       options: {
//         // Disable reading babel configuration
//         babelrc: false,
//         configFile: false,

//         // The configuration for compilation
//         presets: [
//           ["@babel/preset-env", { useBuiltIns: "usage" }],
//           "@babel/preset-react",
//           "@babel/preset-flow",
//           "@babel/preset-typescript"
//         ],
//         plugins: [
//           "@babel/plugin-proposal-class-properties",
//           "@babel/plugin-proposal-object-rest-spread"
//         ]
//       }
//     }
//   });

//   return config;
// };