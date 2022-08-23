const CardReminderModel = require("../models/CardReminderModel");

exports.getAddCardReminder = (req, res, next) => {
	res.render("card-reminder/add-card-reminder.ejs", {
		pageTitle: "Add/Edit Card Reminder",
	});
};

exports.addCardReminder = async (req, res, next) => {
	const cardbankname = req.body.cardbankname;
	const cardname = req.body.cardname;
	const cardnumber = req.body.cardnumber;
	const cardexpirymonth = req.body.cardexpirymonth;
	const cardexpiryyear = req.body.cardexpiryyear;
	const cardrewardrate = req.body.cardrewardrate;
	const cardcharges = req.body.cardcharges;
	const cardlimit = req.body.cardlimit;
	const cardbillgendate = req.body.cardbillgendate;
	const cardduedate = req.body.cardduedate;
	const cardcibildate = req.body.cardcibildate;

	const CardReminder = new CardReminderModel({
		TCR_BankName: cardbankname,
		TCR_CardName: cardname,
		TCR_CardNumber: cardnumber,
		TCR_CardExpiryMonth: cardexpirymonth,
		TCR_CardExpiryYear: cardexpiryyear,
		TCR_CardRewardRate: cardrewardrate,
		TCR_CardCharges: cardcharges,
		TCR_CardLimit: cardlimit,
		TCR_CardBillGenDate: cardbillgendate,
		TCR_CardBillDueDate: cardduedate,
		TCR_CardBillDueDate: cardcibildate,
	});
	try {
		const result = await CardReminder.save();
		if (result) {
			return res.status(201).redirect("/cards/add-billreminder");
		} else {
			console.log("Inside BillController => addCardReminder ==> Error");
			return res.status(500).redirect();
		}
	} catch (err) {
		console.log(err);
	}
};
