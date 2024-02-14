const User = require("../../models/User.js");
const Event = require("../../models/Event.js");

module.exports = {

    Query: {
        async getEvent(_, { eventID }) {
            const event = await Event.findOne({ _id: eventID });
            return event;
        },

        async getEvents() {
            const events = await Event.find();
            return events;
        },
    },

    Mutation: {
        async createEvent(_, {
            createEventInput: {
                host,
                name,
                startTime,
                description,
                points,
                elevation,
                grade,
                terrain,
                distance,
                maxElevation,
                minElevation,
                totalElevationGain,
                startCoordinates,
                endCoordinates,
            },
        }) {
            host = host.toLowerCase();

            const newRoute = {
                points,
                elevation,
                grade,
                terrain,
                distance,
                maxElevation,
                minElevation,
                totalElevationGain,
                startCoordinates,
                endCoordinates,
            };

            const newEvent = new Event({
                host: host,
                name: name,
                startTime: startTime,
                description: description,
                route: newRoute,
            });
            const res = await newEvent.save();

            await User.findOneAndUpdate(
                { username: host },
                { $push: { events: res } },
            );
            return res;
        },

        async deleteEvent(_, {
            host,
            eventID
        }) {
            const res = await User.findOneAndUpdate(
                { username: host },
                { $pull: { events: { _id: eventID }}},
                { returnDocument: 'after'},
            );
            await Event.deleteOne({ _id: eventID });
            return res.events;
        }
    },
};
