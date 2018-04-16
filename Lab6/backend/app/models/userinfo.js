var mongoose = require('mongoose');


var userinfoSchema = mongoose.Schema({
	local			: {
		email		 : String,
		fname	 	 : String,
		lname	 	 : String,
		phoneno		 : String
	}
	
});

module.exports = mongoose.model('UserInfo', userinfoSchema);