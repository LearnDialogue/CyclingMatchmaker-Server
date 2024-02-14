const { model, Schema } = require("mongoose");

// Auxilary gear schema
const gearSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    metric: {
        type: Boolean,
        required: true,
        default: true,
    },
    FTP: {
        type: Number,
        default: 0,
    },
    FTPdate: {
        type: String,
        default: '',
    },
    stravaAPIToken: {
        type: String,
        default: '',
    },
    stravaRefreshToken: {
        type: String,
        default: '',
    },
    createdAt: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: String,
        required: true,
    },
    emailAuthenticated: {
        type: Boolean,
        default: false,
    },
    equipment: [gearSchema],
    events: [
        {
            _id: String,
            host: String,
            name: String,
            startTime: String,
            description: String,
            distance: Number,
        }
    ],
    // rides: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'rides',
    //     }
    // ]
});

module.exports = model('User', userSchema);
