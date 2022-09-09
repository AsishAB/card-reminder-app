const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bankAccountReminderSchema = new Schema(
	{
		TBAM_BankName: {
			type: Schema.Types.ObjectId,
			ref: "Banks", //The User Model. Has to be same as the model. Only available in Mongoose
			required: true,
		},
		TBAM_AccountNumber: {
			type: String,
			required: true,
		},
		TBAM_IFSCCode: {
			type: String,
			//required: true,
		},
		TBAM_InternetBankingUserName: {
			type: String,
			//required: true,
		},
		TBAM_InternetBankingPassword: {
			type: String,
			//required: true,
		},
		TBAM_CreditCards: {
			type: String,
			//required: true,
		},
		TBAM_ContactNumbers: {
			type: String,
			//required: true,
		},
		TBAM_ContactEmailIds: {
			type: String,
			//required: true,
		},
		TBAM_CreatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User", //The User Model. Has to be same as the model. Only available in Mongoose
			//required: true,
		},
		TBAM_UpdatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User", //The User Model. Has to be same as the model. Only available in Mongoose
			//required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("BankAccount", bankAccountReminderSchema);
