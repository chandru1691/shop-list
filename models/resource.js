var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResourceSchema = new Schema({
    name: String,
    shopName: String,
    status: String
});

ResourceSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Resource', ResourceSchema);