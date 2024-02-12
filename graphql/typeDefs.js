const gql = require('graphql-tag');
module.exports = gql`

    ## Main Models
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String!
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

    ## Input Models
    input RegisterInput {
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

    input LoginInput {
        username: String!
        password: String!
        remember: String!
    }

    ## Query List
    type Query {
        getUser: String!
        getRide: String!
        getUsers: [User]
    }

    ## Mutation List
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
    }
`