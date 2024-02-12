const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mergeResolvers } = require("@graphql-tools/merge");

const typeDefs = require("./graphql/typeDefs.js");

const usersResolver = require("./graphql/resolvers/users.js");
const ridesResolver = require("./graphql/resolvers/rides.js");
const resolvers = mergeResolvers([usersResolver, ridesResolver]);

const server = new ApolloServer({
    typeDefs,
    resolvers
});

async function startApolloServer() {
    const { url } = await startStandaloneServer((server), {
        listen: { port: 5000 },
    });
    console.log(`
      🚀  Server is running!
      📭  Query at ${url}
    `);
}

startApolloServer();
