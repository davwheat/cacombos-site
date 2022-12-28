import type { GatsbyConfig } from 'gatsby';

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  flags: {
    // https://www.gatsbyjs.com/docs/how-to/performance/partial-hydration/
    // PARTIAL_HYDRATION: true,
    DEV_SSR: true,
  },
  siteMetadata: {
    title: `Mobile Combos`,
    siteUrl: `https://mobilecombos.com`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-provide-react`,
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Atkinson Hyperlegible\:400,400i,700`, // you can also specify font weights and styles
        ],
        display: 'swap',
      },
    },
    `gatsby-source-local-git`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        resolveSiteUrl: () => 'https://mobilecombos.com',
        excludes: ['/admin/**/*'],
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://mobilecombos.com`,
      },
    },
    `gatsby-plugin-less`,
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        sourceMap: true,
        autoLabel: 'always',
        labelFormat: `[local]`,
        cssPropOptimization: true,
      },
    },
  ],
};

export default config;
