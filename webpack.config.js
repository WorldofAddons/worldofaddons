const path = require('path')
const htmlWebPackPlugin = require('html-webpack-plugin') // compiles html react entry point
const nodeExternals = require('webpack-node-externals') // excludes packing external modules.
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //

const jsRule = {
  test: /\.(js|jsx)?$/,
  use: {
    loader: 'babel-loader'
  }
}

const electronMainConfig = {
  target: 'electron-main',
  externals: [nodeExternals()],
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  module: {
    rules: [ jsRule ]
  },
  devtool: 'source-map',
  plugins: [ ]
}

const htmlRule = {
  test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
      options: { minimize: true }
    }
  ]
}

const cssRule = { // TODO: fix css bundling
  test: /\.css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: './css' }
    },
    'css-loader'
  ]
}

const electronRendererConfig = {
  target: 'electron-renderer',
  externals: [nodeExternals()],
  entry: './src-react/App.jsx',
  output: {
    path: path.resolve(__dirname, 'dist', 'src-react'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [ jsRule, htmlRule ]
  },
  resolve: {
    extensions: [ '.js', '.jsx']
  },
  devtool: 'source-map',
  plugins: [
    new htmlWebPackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({// TODO: fix css bundling
      filename: 'style.bundle.css'
    })
  ]
}

module.exports = [ electronMainConfig, electronRendererConfig ]
