var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var quoteSchema = new Schema({
    date: Date,
    poster: String,
    text: String
});

Quote = mongoose.model('quote', quoteSchema);

module.exports.Quote = Quote;

