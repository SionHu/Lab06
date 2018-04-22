var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	address : String,
	url : String,
	fname : String,
	lname : String,
	email : String,
	phoneno : String,
	hinfo : String,
});

module.exports = mongoose.model('post', postSchema);