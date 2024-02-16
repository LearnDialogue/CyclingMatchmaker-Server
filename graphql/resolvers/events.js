const User = require("../../models/User.js");
const Event = require("../../models/Event.js");
const Route = require("../../models/Route.js");

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
                bikeType,
                difficulty,
                wattsPerKilo,
                intensity,
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

            const newRoute = new Route({
                points: points,
                elevation: elevation,
                grade: grade,
                terrain: terrain,
                distance: distance,
                maxElevation: maxElevation,
                minElevation: minElevation,
                totalElevationGain: totalElevationGain,
                startCoordinates: startCoordinates,
                endCoordinates: endCoordinates,
            });
            const resRoute = await newRoute.save();

            const newEvent = new Event({
                host: host,
                name: name,
                startTime: startTime,
                description: description,
                bikeType: bikeType,
                difficulty: difficulty,
                wattsPerKilo: wattsPerKilo,
                intensity: intensity,
                route: resRoute.id,
            });
            const resEvent = await newEvent.save();

            await User.findOneAndUpdate(
                { username: host },
                { $push: { events: resEvent.id } },
            );
            return resEvent;
        },

        async deleteEvent(_, {
            host,
            eventID
        }) {
            const resEvent = await User.findOneAndUpdate(
                { username: host },
                { $pull: { events: eventID }},
                { returnDocument: 'after'},
            );
            const delEvent = await Event.findOneAndDelete({ _id: eventID });
            await Route.deleteOne({ _id: delEvent.route });
            return resEvent.events;
        },
    },
};
