const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    // Fill out appropriate schema
    username: String,
    firstName: String,
    lastName: String,
});

module.exports = model('User', userSchema);