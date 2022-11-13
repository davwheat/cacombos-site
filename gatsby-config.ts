import type { GatsbyConfig } from 'gatsby';

// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV}`,
// });

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Mobile Combos`,
    siteUrl: `https://mobilecombos.com`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
  ],
};

export default config;
