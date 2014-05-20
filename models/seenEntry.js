var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var seenSchema = new Schema({
    date: Date,
    who: String,
});

SeenEntry = mongoose.model('seenEntry', seenSchema);

module.exports.SeenEntry = SeenEntry;

