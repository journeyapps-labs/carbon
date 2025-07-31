import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  webpackFinal: async (config, { configType }) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          stream: require.resolve('stream-browserify')
        },
        alias: {
          ...config.resolve.alias
          // 'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        }
      },
      devtool: 'inline-source-map',
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.xml$/,
            type: 'asset/source'
          }
        ]
      }
    };
  }
};
export default config;
