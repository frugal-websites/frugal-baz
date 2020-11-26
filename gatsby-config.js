require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
})
const Realm = require("realm")

// https://docs.mongodb.com/realm/node/authenticate/#node-login-anonymous
// Get a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  console.log(2)
  const app = new Realm.App({ id: process.env.GATSBY_REALM_APP_ID })
  // const app = new Realm.App(process.env.GATSBY_REALM_APP_ID)
  console.log(3)
  if (!app.currentUser) {
    console.log(4)
    // If no user is logged in, log in an anonymous user
    try {
      // await app.logIn(Realm.Credentials.anonymous())
      const credentials = Realm.Credentials.anonymous()
      await app.logIn(credentials)

      console.log("Successfully logged in!")
    } catch (err) {
      console.error("Failed to log in", err.message)
      console.log("log Failed to log in log", err)
    }

    console.log(5)
  } else {
    // The logged in user's access token might be stale,
    // Refreshing custom data also refreshes the access token
    console.log(6)
    await app.currentUser.refreshCustomData()
    console.log(7)
  }
  console.log(8)
  // Get a valid access token for the current user
  return app.currentUser.accessToken
}

async function getAuthorizationToken(app) {
  console.log(1)
  const accessToken = await getValidAccessToken(app)

  return `Bearer ${accessToken}`
}

module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // {
    //   resolve: `gatsby-source-mongodb`,
    //   options: {
    //     dbName: process.env.MONGODB_DB_NAME,
    //     collection: process.env.MONGODB_COLLECTION_NAME,
    //     connectionString: process.env.MONGODB_CONNECTION_STRING,
    //   },
    // },

    // REALM_GQL_TOKEN=JkS4PbIuf1ELHnXEIAK4wKhWW9Q9AV80bNbyv8ZNhhq0dZghD9zRQyM0Nwvg4mFB
    // REALM_GQL_URL=https://us-east-1.aws.realm.mongodb.com/api/client/v2.0/app/application-frugal-zdrdn/graphql
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // The offline plugin should be listed after the manifest plugin so that the
    // offline plugin can cache the created manifest.webmanifest.
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: "Frugal", // This is arbitrary, see https://github.com/gatsbyjs/gatsby/issues/18877.
        fieldName: "mongodbGqlApi", // This is arbitrary, see https://github.com/gatsbyjs/gatsby/issues/18877.
        url: process.env.GATSBY_REALM_GQL_URL,
        headers: async () => {
          return {
            Authorization: await getAuthorizationToken(),
          }
        },
      },
    },
  ],
}
