module.exports = {
  stories: ['../*.stories.tsx'],
  webpackFinal: async (config, { configType }) => {
    return {
      ...config,
      devtool: 'inline-source-map',
      module: {
        ...config.module,
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader']
          },
          ...config.module.rules
        ]
      }
    };
  },
  core: {
    builder: 'webpack5'
  }
};
