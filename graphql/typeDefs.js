const gql = require('graphql-tag');
module.exports = gql`
    
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        location: String!
        experience: String!
        gender: String!
        weight: Int!
        height: Int!
        age: Int!
    }

    type Ride {
        id: ID!
        createdAt: String!
        setDate: String!
        location: String!
    }

    type Bike {
        make: String!
        model: String!
        weight: Int!
    }

    type Query {
        getUser: String!
        getRide: String!
    }
`