const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mergeResolvers } = require("@graphql-tools/merge");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefs.js");

// Import Resolvers
const usersResolver = require("./graphql/resolvers/users.js");
const eventsResolver = require("./graphql/resolvers/events.js");
const resolvers = mergeResolvers([usersResolver, eventsResolver]);

const server = new ApolloServer({
    typeDefs,
    resolvers
});

async function startApolloServer() {
    const port = process.env.PORT || 5000;  
    const { url } = await startStandaloneServer((server), {
        listen: { port },
    });
    console.log(`
      🚀  Server is running!
      📭  Query at ${url}
    `);
}

mongoose
  .connect(process.env.MONGODB, {})
  .then(() => {
    console.log("\nSUCCESS: CONNECTED TO DATABASE");
    startApolloServer();
  })
  .catch((err) => {
    console.error(err);
  });
