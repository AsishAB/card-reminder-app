const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardReminderSchema = new Schema(
	{
		TBM_BankName: {
			type: String,
			required: true,
		},
		TBM_BankImage: {
			type: String,
			required: true,
		},
		TBM_CreatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User", //The User Model. Has to be same as the model. Only available in Mongoose
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Banks", cardReminderSchema);
