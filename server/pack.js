const mongoose = require('mongoose');

const schema  = mongoose.Schema({
    name: String,
    nb: Number
});

module.exports = mongoose.model('pack', schema);