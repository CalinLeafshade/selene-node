var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var factoidSchema = new Schema({
    date: Date,
    by: String,
    key: String,
    key_lower: String,
    value: String
});

factoidSchema.methods.toString = function()
{
    return this.key + " is " + this.value;
};

Factoid = mongoose.model('factoid', factoidSchema);

module.exports.Factoid = Factoid;

