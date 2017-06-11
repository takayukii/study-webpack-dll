# study-webpack-dll

## 使い方

webpack.dll.config.jsを別途作成し下記を設定する。

* `output`の`library`にdllの参照先となるグローバル変数名を定義する
* `webpack.DllPlugin`をpluginsに含める

```javascript
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
    publicPath: '/',
    library: 'dll_[name]'
  },
  ...
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: 'dll_[name]'
    })
  ],
  ...
};
```

このwebpack.dll.config.jsを使ってビルドすると`[name]-manifest.json`が出力される。

```json
{
  "name": "dll_vendor",
  "content": {
    "./node_modules/process/browser.js": {
      "id": 1,
      "meta": {}
    },
    "./node_modules/fbjs/lib/invariant.js": {
      "id": 2,
      "meta": {}
    },
    "./node_modules/fbjs/lib/warning.js": {
      "id": 3,
      "meta": {}
    },
    "./node_modules/react-dom/lib/reactProdInvariant.js": {
      "id": 7,
      "meta": {}
    },
    ...
```

dllを参照するwebpack.app.config.jsを作成し下記のように参照させる。

* `webpack.DllReferencePlugin`をpluginsに含める

```javascript
const webpack = require('webpack');

module.exports = {
  entry: {
    index: [
      './src/index.jsx'
    ]
  },
  ...
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dll/vendor-manifest.json')
    })
  ],
  ...
};
```

webpack.app.config.jsでビルドを行うと下記のようなコードが生成される。


index.bundle.js
```javascript
/* 1 */
/***/ (function(module, exports) {

module.exports = dll_vendor;

/***/ }),
```

実際にHTML側でビルドされたvendor.bundle.jsを読み込むと、window.dll_vendorに関数が存在する事が分かる。

```
window.dll_vendor
function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
```

この場合、アプリ本体のindex.bundle.jsはグローバル変数を介してReactにアクセスしている。

### トラブルシュート: babel-polyfillのdll化

babel-polyfillはdll化してHTMLで読み込んだだけでは例えばwindow.dll_polyfillに関数として留まっているだけで実際にPolyfillが差し込まれる事はない。結果としてasync等を使っている場合は下記のようなエラーが発生する。

```
Uncaught ReferenceError: regeneratorRuntime is not defined
```

また、Polyfillも実際には差し込まれていない。

```
window.Promise # IE11
undefined
```

これを回避するにはindex.jsxの先頭で`import 'babel-polyfill'`する必要がある。これをすると例えばwindow.dll_polyfillを介してbabel-polyfillを呼び出し、結果としてグローバル空間にPolyfillが差し込まれる事になる。この場合index.bundle.jsのサイズも小さいままとなる。本当にbabel-polyfillを一緒にビルドするとcore-js等のソースも含まれるようになりサイズが大きく変わるため判別できる。

### babel-polyfillはCommonsChunkPluginで出力する

webpack.polyfill.config.jsを別途作成して下記のように定義する。

```javascript
const webpack = require('webpack');

module.exports = {
  entry: {
    polyfill: [
      'babel-polyfill'
    ]
  },
  ...
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfill',
      minChunks: Infinity,
    })
  ]
};
```

こうすることでpolyfill.bundle.jsがdllとは違う形で出力される。dllの場合はたとえばグローバル変数のdll_polyfillに読み込むための関数が用意される形になるが、この場合はそのまま実行される形になる。そのためHTMLでこのスクリプトを読み込めばPolyfillが適用される形になる。index.jsxで`import 'babel-polyfill'`する必要はない。むしろbabel-polyfillを読み込み済みの状態でさらに読み込むと下記のようなエラーが出る。

```
Uncaught Error: only one instance of babel-polyfill is allowed
```

これはbabel-preset-envを使っている場合、useBuiltIns = false（デフォルト）だと発生するもので、babel-polyfillが意図的に発生させている。useBuiltIns = trueの場合はcore-jsが個別に読み込まれるのでこのようなエラーは発生しないが、Polyfillの二重適用は問題になるのでいずれにしろ避けるべき。
