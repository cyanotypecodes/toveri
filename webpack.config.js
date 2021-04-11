const path = require('path')
module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    library: 'utilities',
    libraryTarget: 'umd', // Target all module types.
    globalObject: 'this', // Ensures 'this' is not referring to window object.
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development', // Minification option.
}