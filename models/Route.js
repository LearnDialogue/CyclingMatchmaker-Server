const { model, Schema } = require("mongoose");

const routeSchema = new Schema({
    points: {
        type: [[Number]],
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
    },
    terrain: {
        type: [String],
        default: [],
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
        type: [Number],
        required: true,
    },
    endCoordinates: {
        type: [Number],
        required: true,
    },
});

module.exports = model('Route', routeSchema);
