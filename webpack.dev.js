const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const commonConfig = require('./webpack.common');

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    }
  },
  parts.setFreeVariable('process.env.NODE_ENV', 'production'),
  parts.generateSourceMaps({ type: 'cheap-module-source-map' }),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS(),
  parts.loadImages()
]);

module.exports = () => {
  return merge(commonConfig, developmentConfig);
};
