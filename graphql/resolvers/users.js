const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    handleInputError,
    handleGeneralError,
  } = require("../../util/error-handling");

const {
    validateRegisterInput,
    validateLoginInput
} = require('../../util/validators');
  
const { fetchLocation } = require('../../util/geocoder.js');

const User = require("../../models/User.js");

require("dotenv").config();

function generateToken(user, time) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.SECRET,
      {
        expiresIn: time,
      }
    );
  }

module.exports = {
    Query: {
        async getUser(_, { username }) {
            try {
                const user = await User.findOne({ username });
                return user;
            } catch (error) {
                handleGeneralError(error, "User not found.");
            }
        },

        async getUsers() {
            try {
                const users = await User.find();
                return users;
            } catch (error) {
                handleGeneralError(error, "Users not found.");
            }
        },
    },

    Mutation: {
        async register(_, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword,
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

            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword,
                firstName,
                lastName,
                sex,
                birthday,
                weight,
                metric,
            )

            if (!valid) {
                handleInputError(errors);
            }

            const usernameCheck = await User.findOne({ username });
            if (usernameCheck) {
                errors.general = "An account with that username already exists.";
                handleInputError(errors);
            }
    
            const emailCheck = await User.findOne({ email });
            if (emailCheck) {
                errors.general = "An account with that e-mail already exists.";
                handleInputError(errors);
            }

            password = await bcrypt.hash(password, 12);

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
                eventsHosted: [],
                eventsJoined: [],
            });
            const res = await newUser.save();

            const loginToken = generateToken(newUser, "24h");

            return {
                ...res._doc,
                id: res._id,
                loginToken,
            };
        },

        async login(_, { 
            loginInput: {
                username,
                password,
                remember,
            },
        }) {
            username = username.toLowerCase();
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                handleInputError(errors);
            }

            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found.";
                handleInputError(errors);
            }

            const passwordCheck = await bcrypt.compare(password, user.password);
            if (!passwordCheck) {
              errors.general = "Wrong credentials.";
              handleInputError(errors);
            }

            time = remember === "true" || remember === true ? "30d" : "24h";
            const loginToken = generateToken(user, time);

            return {
                ...user._doc,
                id: user._id,
                loginToken,
            };
        },

        /*
        Front-end should cache all unique calls to this function. If calling for the first time, 
        include just these arguments: USERNAME, LOCATIONNAME. If calling on a cached query, 
        include these arguments, which should be pulled from the storage on the front end. 
        Arguments: USERNAME, LOCATIONCOORDS, LOCATIONNAME. If you want to change radius, it can
        be included in any combination of the function call, even just by itself. Don't forget
        to include the username for all function calls.
         */
        async setRegion(_, {
            setRegionInput: {
                username,
                locationCoords,
                locationName,
                radius,
            }
        }) {
            var name;
            var coords;

            if (locationCoords) {
                name = locationName;
                coords = locationCoords;
            } else if (locationName) {
                const fetchedData = await fetchLocation(locationName);
                name = fetchedData.display_name;
                coords = [fetchedData.lon, fetchedData.lat];
            }

            const updatedUser = await User.findOneAndUpdate(
                { username },
                {
                    locationName: name,
                    locationCoords: coords,
                    radius: radius,
                },
                { returnDocument: 'after'},
            );
            return updatedUser;
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
