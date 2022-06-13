const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    library: {
      name: 'textmasks',
      type: 'umd2'
    },
    publicPath: '',
    filename: 'textmasks.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this'
  },
  devServer: {
    port: 8123,
    static: path.join(__dirname, ''),
    //watchFiles: true,
    hot: true
  }
};