const { model, Schema } = require("mongoose");

// Auxilary coordinate schema
const coordinateSchema = new Schema({
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
});

// Auxilary route schema
const routeSchema = new Schema({
    points: {
        type: [coordinateSchema],
        default: [],
        required: true,
    },
    elevation: {
        type: [Number],
        default: [],
        required: true,
    },
    grade: {
        type: [Number],
        default: [],
        required: true,
    },
    terrain: {
        type: [String],
        default: [],
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    maxElevation: {
        type: Number,
        required: true,
    },
    minElevation: {
        type: Number,
        required: true,
    },
    totalElevationGain: {
        type: Number,
        required: true,
    },
    startCoordinates: {
        type: coordinateSchema,
        required: true,
    },
    endCoordinates: {
        type: coordinateSchema,
        required: true,
    }
});

const eventSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
   route: {
        type: routeSchema,
        required: true,
   }
});

module.exports = model('User', userSchema);
