const merge = require('webpack-merge');
const webpack = require('webpack');
const parts = require('./webpack.parts');
// const bootstrapEntryPoints = require('./webpack.bootstrap');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const faviconUrl = './src/assets/img/favicon.png';

module.exports = merge([
  {
    // The entry point for the bundle. Entries have to resolve to files!
    // If a directory contains *index.js*, it resolves to that.
    entry: {
      app: [parts.paths.src]

      // app: [bootstrapEntryPoints.dev, parts.paths.src]

      //vendor: ['jquery', 'moment']
    },
    // Set of options instructing webpack on how and where it should output
    // the bundles, assets and anything else you bundle or load with webpack.
    output: {
      path: parts.paths.build,
      filename: '[name].js'
    },
    // Use plugins to add functionality typically related to bundles in webpack.
    plugins: [
      // Webpack generate all your favicons and icons for you
      new FaviconsWebpackPlugin(faviconUrl),
      // Simplifies creation of HTML files to serve your webpack bundles.
      // Useful for webpack bundles that include a hash in the filename which changes every compilation.
      new HtmlWebpackPlugin({
        title: 'Avius'
      }),
      // Needed for Bootstrap
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  },
  parts.loadJavaScript({ include: parts.paths.src }),
  parts.lintJavaScript({ include: parts.paths.src }),
  parts.loadFonts({
    options: {
      name: './fonts/[name].[hash:8].[ext]',
      publicPath: '../' // override the default per loader definition
    }
  }),
  parts.loadXML(),
  parts.lintCSS({ include: parts.paths.src }),
  parts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) =>
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
    },
    {
      name: 'manifest',
      minChunks: Infinity
    }
  ])
]);
