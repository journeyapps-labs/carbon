module.exports = {
  stories: ['../*.stories.tsx'],
  webpackFinal: async (config, { configType }) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': require.resolve('@emotion/react'),
          '@emotion/styled': require.resolve('@emotion/styled'),
          '@emotion/react': require.resolve('@emotion/react'),
          'emotion-theming': require.resolve('@emotion/react')
        }
      },
      devtool: 'inline-source-map',
      module: {
        ...config.module,
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader']
          },
          ...config.module.rules,
          {
            test: /\.xml$/,
            type: 'asset/source'
          }
        ]
      }
    };
  },
  core: {
    builder: 'webpack5'
  },
  addons: [
    {
      name: '@storybook/addon-essentials'
    }
  ]
};
