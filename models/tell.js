var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tellSchema = new Schema({
    date: Date,
    from: String,
    message: String,
    to: String,
    told: Boolean
});

Tell = mongoose.model('tell', tellSchema);

module.exports.Tell = Tell;

