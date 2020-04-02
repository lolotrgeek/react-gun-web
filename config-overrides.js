const path = require('path');
const { override, addBabelPlugins, babelInclude } = require('customize-cra');
const fs = require("fs");

(() => {
    const filePath = require.resolve(`react-native-vector-icons/lib/toolbar-android.js`);
    const code = fs.readFileSync(filePath).toString();
    fs.writeFileSync(filePath, code.replace(`import { ToolbarAndroid } from './react-native';`, `import ToolbarAndroid from '@react-native-community/toolbar-android';`));
  })()

module.exports = override(
  ...addBabelPlugins('@babel/plugin-proposal-class-properties'),
  babelInclude([
    path.resolve(__dirname, 'node_modules/react-native-elements'),
    path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
    path.resolve(__dirname, 'node_modules/react-native-ratings'),
    path.resolve(__dirname, 'src'),
  ])
);