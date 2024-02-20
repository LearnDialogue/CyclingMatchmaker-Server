const usersResolver = require("./users");
const eventsResolver = require("./events");

module.exports = {
    Query: {
        ...usersResolver.Query,
        ...eventsResolver.Query,
    },

    Mutation: {
        ...usersResolver.Mutation,
        ...eventsResolver.Mutation,
    }
};