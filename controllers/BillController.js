const CardReminderModel = require("../models/CardReminderModel");
const BankModel = require("../models/BankModel");
const Crypt = require("../helpers/encrypt_decrypt/encryptDecryptText");
const globalURL = require("../helpers/global-url").globalURL;

exports.getAddCardReminder = async (req, res, next) => {
	const bankList = await BankModel.find();
	const countBankList = await BankModel.find().countDocuments();
	res.render("card-reminder/add-card-reminder.ejs", {
		pageTitle: "Add/Edit Card Reminder",
		bankList: bankList,
		countBankList: countBankList,
	});
};

exports.getCardList = async (req, res, next) => {
	const userId = "6305efe8c4f33170a06934b2";
	const cardDetails = await CardReminderModel.find({
		TCR_CardCreatedBy: userId,
	})
		.populate("TCR_BankName")
		.populate("TCR_CardCreatedBy");
	const countCardDetails = await CardReminderModel.find({
		TCR_CardCreatedBy: userId,
	}).countDocuments();

	if (countCardDetails > 0) {
		cardDetails.forEach(element => {
			element.CardNumber = Crypt.decrypt(element.TCR_CardNumber, "private.pem");
			element.CardSecretCode = Crypt.decrypt(
				element.TCR_CardSecretCode,
				"private.pem"
			);
			if (Number(element.TCR_CardCharges) == 0) {
				element.TCR_CardCharges = 0 + " (LTF)";
			} else {
				element.TCR_CardCharges = Number(element.TCR_CardCharges);
			}
			element.TCR_BankName.TBM_BankImage =
				globalURL + element.TCR_BankName.TBM_BankImage;
			element.action =
				'<a href="/cards/edit-card/' +
				element._id +
				'" class="btn border border-primary text-primary">Edit</a> &nbsp;<button class="btn border border-danger text-danger" onclick="deleteProduct(\'' +
				element._id +
				"', this)\"> Delete </button>";
		});
	}

	res.render("card-reminder/card-list.ejs", {
		pageTitle: "Card List",
		cardDetails: cardDetails,
		countCardDetails: countCardDetails,
	});
};

exports.addCardReminder = async (req, res, next) => {
	const userId = "6305efe8c4f33170a06934b2";

	const cardbankname = req.body.cardbankname;
	const cardname = req.body.cardname;
	const cardnumber = req.body.cardnumber;
	const cardexpirymonth = req.body.cardexpirymonth;
	const cardexpiryyear = req.body.cardexpiryyear;
	const cardcvv = req.body.cardcvv;
	const cardrewardrate = req.body.cardrewardrate;
	const cardcharges = req.body.cardcharges;
	const cardlimit = req.body.cardlimit;
	const cardbillgendate = req.body.cardbillgendate;
	const cardduedate = req.body.cardduedate;
	const cardcibildate = req.body.cardcibildate;
	const createdBy = userId;

	const encryptedCardNumber = Crypt.encrypt(cardnumber, "public.pem");
	const encryptedCardCVV = Crypt.encrypt(cardcvv, "public.pem");
	const CardReminder = new CardReminderModel({
		TCR_BankName: cardbankname,
		TCR_CardName: cardname,
		TCR_CardNumber: encryptedCardNumber,
		TCR_CardExpiryMonth: cardexpirymonth,
		TCR_CardExpiryYear: cardexpiryyear,
		TCR_CardSecretCode: encryptedCardCVV,
		TCR_CardRewardRate: cardrewardrate,
		TCR_CardCharges: cardcharges,
		TCR_CardLimit: cardlimit,
		TCR_CardBillGenDate: cardbillgendate,
		TCR_CardBillDueDate: cardduedate,
		TCR_CardCIBILReportingDate: cardcibildate,
		TCR_CardCreatedBy: createdBy,
	});
	try {
		const result = await CardReminder.save();
		if (result) {
			return res.status(201).redirect("/cards/card-list");
		} else {
			console.log("Inside BillController => addCardReminder ==> Error");
			return res.status(500).redirect("/cards/add-billreminder");
		}
	} catch (err) {
		console.log(err);
	}
};
