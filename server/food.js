const mongoose = require('mongoose');

const schema  = mongoose.Schema({
    name : String,
    expiration : Date,
    quantity: Number,
	unit: String,
	categories: [{
		type: String
	}],
	storage: String
});

module.exports = mongoose.model('food', schema);