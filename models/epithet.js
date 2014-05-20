var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var epithetSchema = new Schema({
    date: Date,
    by: String,
    value: {type: String, unique: true }
});

Epithet = mongoose.model('epithet', epithetSchema);

module.exports.Epithet = Epithet;

