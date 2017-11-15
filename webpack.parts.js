const path = require('path');
const webpack = require('webpack');
const cssnano = require('cssnano');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

// Set paths for source and build folder
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};
exports.paths = PATHS;

// Control environment variables
exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);
  return {
    plugins: [new webpack.DefinePlugin(env)]
  };
};

// Delete build folder before building
exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])]
});

// WDS - Webpack Development Configuration
// If you access through http://localhost:8080/webpack-dev-server/, WDS provides status information at the top.
exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    // Enable history API fallback so HTML5 History API based routing works.
    historyApiFallback: true,
    // Display only errors to reduce the amount of output.
    stats: 'errors-only',
    // Parse host and port from env to allow customization.
    // If you use Docker, Vagrant or Cloud9, set  host: options.host || '0.0.0.0';
    host: host, // Defaults to `localhost`
    port: port, // Defaults to 8080

    // If you get errors with older versions of Windows, Ubuntu, Vagrant, and Docker, uncomment the following lines

    /*  watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000,
    },
    plugins: [
      // Ignore node_modules, so CPU usage with poll watching, drops significantly.
      new webpack.WatchIgnorePlugin([
        path.join(__dirname, 'node_modules')
      ]),
    ]*/

    // overlay: show captured errors and warnings in browser
    overlay: {
      errors: true,
      warnings: true
    }
  }
});

// Connecting Babel with webpack through babel-loader
exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        loader: 'babel-loader',
        options: {
          // Enable caching for improved performance during development.
          cacheDirectory: true
        }
      }
    ]
  }
});

// To load CSS, you need to use css-loader and style-loader.
// css-loader goes through possible @import and url() lookups within the matched files and treats them as a regular ES6 import.
// style-loader injects the styling through a style element.
exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
});

// Inline assets by using url-loader.
// It emits images as base64 strings within your JavaScript bundles.
// Decreases the number of requests needed while growing the bundle size.
// Perfect for development.
exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options
        }
      }
    ]
  }
});

// Stores separate images to files.
// Perfect for production.
exports.extractImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options
        }
      }
    ]
  }
});

// Supports Multiple Formats using file-loader, not url-loader
// It's a trade-off as you get extra requests, but perhaps it's the right move.
exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options
        }
      }
    ]
  }
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
});

// Ensure that ESLint gets executed before anything else (enforce field),
// so linting happens before any other processing.
exports.lintJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'eslint-loader',
        options
      }
    ]
  }
});

// lint CSS with Stylelint through postcss-loader.
exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            require('stylelint')({
              // Ignore node_modules CSS
              ignoreFiles: 'node_modules/**/*.css'
            })
          ]
        }
      }
    ]
  }
});

// CSS bundles generation using ExtractTextPlugin.
// It can aggregate multiple CSS files into one.
// The plugin then picks up the result aggregated by the loader and emits a separate file.
exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: './css/[name].[contenthash:8].css',
    publicPath: '../'
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [plugin]
  };
};

// Working with Autoprefixer is simple:
// just forget about vendor prefixes and write normal CSS according to the latest W3C specs.
exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')]
  }
});

// Remove unused selectors from your CSS.
// You should use it with the extract-text-webpack-plugin.
exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })]
});

// Extract vendor related code to a bundle of its own.
// Allows multiple splits through it.
exports.extractBundles = bundles => ({
  plugins: bundles.map(
    bundle => new webpack.optimize.CommonsChunkPlugin(bundle)
  )
});

// UglifyJS doesn't support ES6 syntax yet making it problematic if Babel and babel-preset-env are used while targeting specific browsers.
// So, the best choice is using babili.
exports.minifyJavaScript = () => ({
  plugins: [new BabiliPlugin()]
});

// OptimizeCSSAssetsPlugin avoids duplicated CSS by operating on the generated result and thus can lead to a better result.
// The best choice.
exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});

// Generates a small comment at the beginning of the generated files.
exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version()
    })
  ]
});
