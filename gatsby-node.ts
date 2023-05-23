import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import path from 'path';

/**
 * Customise webpack config.
 */
export const onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions }) => {
  if (stage === 'develop' || stage === 'build-javascript') {
    actions.setWebpackConfig({
      plugins: [new CaseSensitivePathsPlugin()],
    });
  }

  const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

  if (process.env.NODE_ENV !== 'development' && process.env.SENTRY_AUTH_TOKEN) {
    actions.setWebpackConfig({
      plugins: [
        sentryWebpackPlugin({
          sourcemaps: {
            assets: ['./public/**'],
            ignore: [],
            deleteFilesAfterUpload: [],
          },
          // ignore: ['app-*', 'polyfill-*', 'framework-*', 'webpack-runtime-*'],
        }),
      ],
    });
  }

  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /.jsonc$/,
          use: [
            {
              loader: `jsonc-loader`,
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@data': path.resolve(__dirname, 'src/data'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@functions': path.resolve(__dirname, 'src/functions'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@atoms': path.resolve(__dirname, 'src/atoms'),
        '@api': path.resolve(__dirname, 'src/cloud-api'),
      },
    },
  });
};
