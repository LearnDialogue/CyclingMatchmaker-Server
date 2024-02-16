const User = require("../../models/User.js");

module.exports = {
    Query: {
        async getUser(_, { username }) {
            const user = await User.findOne({ username });
            return user;
        },

        async getUsers() {
            const users = await User.find();
            return users;
        },
    },

    Mutation: {
        async register(_, {
            registerInput: {
                username,
                email,
                password,
                firstName,
                lastName,
                sex,
                birthday,
                weight,
                metric,
            },
        }) {
            firstName = firstName.trim();
            lastName = lastName.trim();
            email = email.toLowerCase();
            username = username.toLowerCase();

            const newUser = new User({
                username: username,
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                sex: sex,
                birthday: birthday,
                weight: weight,
                metric: metric,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                gear: [],
                events: [],
            });
            const res = await newUser.save();

            return {
                ...res._doc,
                id: res._id,
            };
        },

        async login(_, { username, password, remember }) {
            // Logic to login user
        },

        async addGear(_, {
            addGearInput: {
                username,
                type,
                subtype,
                make,
                model,
                weight,
                distance,
            },
        }) {
            const newGear = {
                type,
                subtype,
                make,
                model,
                weight,
                distance,
            };
            const res = await User.findOneAndUpdate(
                { username },
                { $push: { equipment: newGear } },
                { returnDocument: 'after' },
            );
            return res.equipment;
        },

        async removeGear(_, {
            username,
            gearID,
        }) {
            const res = await User.findOneAndUpdate(
                { username },
                { $pull: { equipment: { _id: gearID } } },
                { returnDocument: 'after'},
            );
            return res.equipment;
        }
    }
};
