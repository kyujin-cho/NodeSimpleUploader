module.exports = [{
  mode: 'development',
  entry : ['babel-polyfill', './render.orig.js'],
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'render.webpack.js',
    sourceMapFilename: 'render.webpack.js.map',
    publicPath: __dirname + '/public/javascripts'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'env']
        }
      }
    ]
  }
}]