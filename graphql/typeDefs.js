const gql = require('graphql-tag');
module.exports = gql`

    ##  MAIN MODELS

    ## User Model
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        sex: String!
        birthday: String!
        weight: Int!
        metric: Boolean!
        FPT: Float
        FPTdate: String
        equipment: [Gear]
        stravaAPIToken: String
        stravaRefreshToken: String
        events: [Event]
        createdAt: String!
        lastLogin: String!
        emailAuthenticated: String
    }

    ## User/Gear Aux Model
    type Gear {
        id: ID!
        type: String!
        make: String!
        model: String!
        weight: Int!
        distance: Float!
    }

    ## Event Model
    type Event {
        id: ID!
        host: String!
        name: String!
        startTime: String!
        distance: Float!
        description: String
        route: Route!
    }

    ## Event/Route Aux Model
    type Route {
        id: ID!
        points: [[Number]]!
        elevation: [Number]!
        grade: [Number]!
        terrain: [Number]!
        distance: Number!
        maxElevation: Number!
        minElevation: Number!
        totalElevationGain: Number!
        startCoordinates: [Number]!
        endCoordinates: [Number]!
    }

    # type Ride {
    #     id: ID!
    #     createdAt: String!
    #     setDate: String!
    #     location: String!
    # }



    ## INPUT MODELS
    input RegisterInput {
        username: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        sex: String!
        birthday: String!
        weight: Int!
        metric: Boolean!
    }

    input LoginInput {
        username: String!
        password: String!
        remember: String!
    }

    input AddGearInput {
        username: String!
        type: String!
        make: String!
        model: String!
        weight: Int!
        distance: Float!
    }

    ## QUERY LIST
    type Query {
        getUser: String!
        getRide: String!
        getUsers: [User]
    }

    ## MUTATION LIST
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
        addGear(addGearInput: AddGearInput): [Gear]!
        removeGear(username: String!, gearID: String!): [Gear]!
    }
`