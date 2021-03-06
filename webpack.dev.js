const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const commonConfig = require('./webpack.common');

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    }
  },
  parts.setFreeVariable('process.env.NODE_ENV', 'production'),
  parts.generateSourceMaps({ type: 'inline-source-map' }),
  parts.devServer({
    host: process.env.HOST,
    port: 9090
  }),
  parts.loadCSS(),
  parts.loadImages()
]);

module.exports = () => {
  return merge(commonConfig, developmentConfig);
};
