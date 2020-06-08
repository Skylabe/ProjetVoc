const mongoose = require('mongoose');

const schema  = mongoose.Schema({
    originalWord : String,
    tradWord : String,
    packId: String
});

module.exports = mongoose.model('words', schema);