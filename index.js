const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mergeResolvers } = require("@graphql-tools/merge");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefs.js");

// Import Resolvers
const usersResolver = require("./graphql/resolvers/users.js");
const ridesResolver = require("./graphql/resolvers/rides.js");
const resolvers = mergeResolvers([usersResolver, ridesResolver]);

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

startApolloServer();
