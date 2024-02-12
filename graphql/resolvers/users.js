module.exports = {
    Query: {
        async getUser() {
            // Logic to return user info
            return "Got This User";
        },
    },
    Mutation: {
        async register(_, {
            registerInput: {
                firstName,
                lastName,
                username,
                email,
                location,
                experience,
                gender,
                weight,
                height,
                age,
            },
            }
        ) {
            // Logic to add new user to database
        },

        async login(_, { username, password, remember }) {
            // Logic to login user
        },
    }
};
