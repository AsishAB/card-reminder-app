const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = {
	TUM_FirstName: {
		type: String,
		required: true,
	},
	TUM_LastName: {
		type: String,
		required: true,
	},
	TUM_Role: {
		type: String,
		required: true,
	},
	TUM_Email: {
		type: String,
		required: true,
	},
	TUM_MobileNo: {
		type: String,
		required: true,
	},
	TUM_Password: {
		type: String,
		required: true,
	},
};

module.exports = mongoose.model("User", userSchema);
