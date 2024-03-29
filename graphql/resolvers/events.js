const GraphQLError = require('graphql').GraphQLError;
const User = require("../../models/User.js");
const Event = require("../../models/Event.js");
const Route = require("../../models/Route.js");
const { fetchLocation } = require('../../util/geocoder.js');


module.exports = {

    Query: {
        async getEvent(_, { eventID }) {
            const event = await Event.findOne({ _id: eventID });
            return event;
        },

        async getAllEvents() {
            const events = await Event.find();
            return events;
        },

        async getEvents(_, {
            getEventsInput: {
                page,
                pageSize,
                startDate,
                endDate,
                bikeType,
                wkg,
                location,
                radius,
                match,
            },
        }, contextValue) {
            if (!contextValue.user.username) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }
            //check if location and/or radius is null
            let locationCoords = null;
            if(!location | !radius) {
                geoParam = await User.findOne({ username: contextValue.user.username }).select('locationCoords radius');
                if (!location)
                    locationCoords = geoParam.locationCoords;
                if (!radius)
                    radius = geoParam.radius;
            }
            //if location string provided, find corresponding coords
            else if (location){
                const fetchResult = await fetchLocation(location, null);
                locationCoords = [parseFloat(fetchResult.lon), parseFloat(fetchResult.lat)];
            }
            if (locationCoords.length === 0) {
                throw new GraphQLError('Location not provided nor found in user document.', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                });
            }
            if(!page)
                page = 0;
            if(!pageSize)
                pageSize = 50;
            if(!bikeType) {
                bikeType = [];
            }
            if(!wkg) {
                wkg = [];
            }

            const events = await Event.aggregate(
                [   
                    {
                        $match: {
                            locationCoords: {
                                $geoWithin: {
                                    $centerSphere: [
                                        locationCoords,
                                        radius / 6378.1]
                                }
                            },
                            startTime: endDate ?
                            {
                                $gte: startDate,
                                $lte: endDate,
                            } : 
                            {
                                $gte: startDate
                            },
                            bikeType: bikeType.length ?
                            {
                                $in: bikeType
                            } : {$nin: []},
                            difficulty: wkg.length ?
                            {
                                $in: wkg
                            } : {$nin: []},
                        }
                    },
                    {
                        $facet: {
                            metadata: [{ $count: 'totalCount' }],
                            data: [{ $skip: (page) * pageSize }, { $limit: pageSize }],
                        }
                    }
                ]
            );
            return events[0].data;
        },

        async getJoinedEvents(_, {}, contextValue) {
            if (!contextValue.user.username) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }

            const eventIDList = await User.findOne({ username: contextValue.user.username }).select('eventsJoined');

            var eventList = [];
            for (const eventJoined of Object.values(eventIDList.eventsJoined)) {
                const eventInfo = await Event.findOne({ _id: eventJoined });
                if (eventInfo) eventList.push(eventInfo);
            }
            return eventList;
        },

        async getHostedEvents(_, {}, contextValue) {
            if (!contextValue.user.username) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }

            const eventIDList = await User.findOne({ username: contextValue.user.username }).select('eventsHosted');

            var eventList = [];
            for (const eventHosted of Object.values(eventIDList.eventsHosted)) {
                const eventInfo = await Event.findOne({ _id: eventHosted });
                if (eventInfo) eventList.push(eventInfo);
            }
            return eventList;
        },

        async getRoute(_, { routeID }) {
            const route = await Route.findOne({ _id: routeID });
            return route;
        }
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
        }, contextValue) {
            if (!contextValue.user.username) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }
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

            const locFetched = await fetchLocation(null, startCoordinates);
            const locCoords = [startCoordinates[1],startCoordinates[0]];

            const newEvent = new Event({
                host: host,
                name: name,
                locationName: locFetched.display_name,
                locationCoords: locCoords,
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
                { $push: { eventsHosted: resEvent.id } },
            );
            return resEvent;
        },

        async deleteEvent(_, {
            host,
            eventID
        }) {
            const resEvent = await User.findOneAndUpdate(
                { username: host },
                { $pull: { eventsHosted: eventID }},
                { returnDocument: 'after'},
            );
            const delEvent = await Event.findOneAndDelete({ _id: eventID });
            await Route.deleteOne({ _id: delEvent.route });
            return resEvent.events;
        },

        async joinEvent(_, { eventID }, contextValue) {
            if (!contextValue.user.username) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }
            const username = contextValue.user.username;
            const resEvent = await Event.findOneAndUpdate(
                { _id: eventID },
                { $push: { participants: username }},
                { returnDocument: 'after' },
            );
            await User.findOneAndUpdate(
                { username },
                { $push: { eventsJoined: eventID }},
            );
            return resEvent;
        },

        async leaveEvent(_, { eventID }, contextValue) {
            if (!contextValue.user.username) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                    },
                })
            }
            const username = contextValue.user.username;
            const resEvent = await Event.findOneAndUpdate(
                { _id: eventID },
                { $pull: { participants: username }},
                { returnDocument: 'after' },
            );
            await User.findOneAndUpdate(
                { username },
                { $pull: { eventsJoined: eventID }},
            );
            return resEvent;
        }
    },
};
