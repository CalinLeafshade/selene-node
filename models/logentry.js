var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var logEntrySchema = new Schema({
    date: Date,
    nick: String,
    text: String,
    channel: String,
    type: String // message, join, quit, action
});

LogEntry = mongoose.model('logEntry', logEntrySchema);

module.exports.LogEntry = LogEntry;

