const { model, Schema } = require("mongoose");

const eventSchema = new Schema({
    host: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    route: {
        type: String,
        required: true,
    },
});

module.exports = model('Event', eventSchema);
