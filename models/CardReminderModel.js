const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardReminderSchema = new Schema(
	{
		TCR_BankName: {
			type: String,
			required: true,
		},
		TCR_CardName: {
			type: String,
			required: true,
		},
		TCR_CardNumber: {
			type: String,
			required: true,
		},
		TCR_CardExpiryMonth: {
			type: String,
			required: true,
		},
		TCR_CardExpiryYear: {
			type: String,
			required: true,
		},
		TCR_CardRewardRate: {
			type: String,
		},
		TCR_CardCharges: {
			type: String,
			required: true,
		},
		TCR_CardLimit: {
			type: String,
			required: true,
		},
		TCR_CardBillGenDate: {
			type: String,
			required: true,
		},
		TCR_CardBillDueDate: {
			type: String,
			required: true,
		},
		TCR_CardBillDueDate: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("CardReminder", cardReminderSchema);
