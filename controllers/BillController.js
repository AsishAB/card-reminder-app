const CardReminderModel = require("../models/CardReminderModel");
const BankModel = require("../models/BankModel");
const Crypt = require("../helpers/encrypt_decrypt/encryptDecryptText");
var XLSX = require("xlsx");
const globalURL = require("../helpers/global-url").globalURL;
const Helper = require("../helpers/helpers/helper");

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
				element.TCR_CardCharges = 0 + " (Life Time Free)";
			} else {
				element.TCR_CardCharges = Number(element.TCR_CardCharges);
			}
			element.TCR_BankName.TBM_BankImage =
				globalURL + element.TCR_BankName.TBM_BankImage;
			element.action = `
				<button class="btn border border-success text-success" onclick="viewCard('${element._id}')"> <i class="fa-solid fa-eye"></i> 
				</button>&nbsp;
				<a href="/cards/edit-card/${element._id}" class="btn border border-primary text-primary"><i class="fas fa-edit"></i></a> &nbsp;
				<button class="btn border border-danger text-danger" onclick="deleteCard('${element._id}')"> <i class="fa-solid fa-trash-can"></i> </button>`;
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

exports.viewCard = async (req, res, next) => {
	const cardId = req.params.cardId;
	// console.log(cardId);
	const data = {};
	// let cardNumber;
	// let separatedCardNumber = [];
	// let splitValue = 4;
	// let totalLengthofCardNumber;

	try {
		const cardDetail = await CardReminderModel.findById(cardId).populate(
			"TCR_BankName"
		);
		if (!cardDetail) {
			data.response = "error";
			data.message = "Card Not Found";
			return res.json(data);
		}

		cardDetail.TCR_CardNumber = Crypt.decrypt(
			cardDetail.TCR_CardNumber,
			"private.pem"
		);
		let cardNumber = cardDetail.TCR_CardNumber;
		cardNumber = Helper.addZeroes(cardNumber);
		let totalLengthofCardNumber = cardNumber.length;
		let separatedCardNumber = [];
		let splitValue;
		let spValue = 4;
		splitValue = spValue;

		let endOfLoop = totalLengthofCardNumber / splitValue;

		for (let i = 0; i < endOfLoop; i++) {
			totalLengthofCardNumber = totalLengthofCardNumber - spValue;

			let splittedCardValue = cardNumber.substr(
				totalLengthofCardNumber,
				spValue
			);
			separatedCardNumber.push(splittedCardValue);
			splitValue += spValue;
		}
		separatedCardNumber = Helper.reverseArray(separatedCardNumber);
		separatedCardNumber = separatedCardNumber.toString().replace(/,/g, "-");
		cardDetail.TCR_CardNumber = separatedCardNumber;
		cardDetail.TCR_CardSecretCode = Crypt.decrypt(
			cardDetail.TCR_CardSecretCode,
			"private.pem"
		);
		cardDetail.TCR_BankName.TBM_BankImage =
			globalURL + cardDetail.TCR_BankName.TBM_BankImage;
		data.data = cardDetail;
		data.response = "success";
		data.message = "Card Found";
		return res.json(data);
	} catch (err) {
		console.log(err);
		data.response = "Catch Block error";
		data.message = err;
		return res.json(data);
	}
};

exports.deleteCard = async (req, res, next) => {
	const cardId = req.params.cardId;
	const data = {};
	try {
		const cardDetail = await CardReminderModel.findById(cardId);
		if (!cardDetail) {
			data.response = "error";
			data.message = "Card Not Found";
			return res.json(data);
		}
		const result = await CardReminderModel.findByIdAndDelete(cardId);
		if (result) {
			data.response = "success";
			data.message = "Card Deleted";
			return res.json(data);
		}
	} catch (err) {
		data.response = "error";
		data.message = err;
		return res.json(data);
	}
};
