var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String
    },
    color: {
        type: String
    },
    textColor: {
        type: String
    },
    userid : Number,
    username : String,
    groupid: Number
});

eventSchema.plugin(autoIncrement.plugin, 'Event');

module.exports = mongoose.model('Event', eventSchema);