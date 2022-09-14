const CardReminderModel = require("../models/EWalletModel");

const BankModel = require("../models/BankModel");
const Crypt = require("../helpers/encrypt_decrypt/encryptDecryptText");

const globalURL = require("../helpers/global-url").globalURL;
const Helper = require("../helpers/helpers/helper");

exports.getAddCardReminder = async (req, res, next) => {
	const bankList = await BankModel.find();
	const countBankList = await BankModel.find().countDocuments();
	res.render("card-reminder/add-card-reminder.ejs", {
		pageTitle: "Add/Edit Card Reminder",
		bankList: bankList,
		countBankList: countBankList,
		cardDetail: null,
		errorMessage: "",
	});
};

exports.editCard = async (req, res, next) => {
	const cardId = req.params.cardId;
	const userId = req.user._id;
	const bankList = await BankModel.find();
	const countBankList = await BankModel.find().countDocuments();

	const cardDetail = await CardReminderModel.findById(cardId);
	// console.log(cardDetail);

	if (!cardDetail) {
		return res.render("card-reminder/add-card-reminder.ejs", {
			pageTitle: "Add/Edit Card Reminder",
			bankList: bankList,
			countBankList: countBankList,
			cardDetail: null,
			errorMessage: "No Card Found",
		});
	}

	if (cardDetail.TCR_CardCreatedBy.toString() !== userId.toString()) {
		return res.render("card-reminder/add-card-reminder.ejs", {
			pageTitle: "Add/Edit Card Reminder",
			bankList: bankList,
			countBankList: countBankList,
			cardDetail: null,
			errorMessage: "Un-Authorized",
		});
	}
	cardDetail.TCR_CardNumber = Crypt.decrypt(
		cardDetail.TCR_CardNumber,
		"private.pem"
	);
	cardDetail.TCR_CardSecretCode = Crypt.decrypt(
		cardDetail.TCR_CardSecretCode,
		"private.pem"
	);

	res.render("card-reminder/add-card-reminder.ejs", {
		pageTitle: "Add/Edit Card Reminder",
		bankList: bankList,
		countBankList: countBankList,
		cardId: cardId,
		cardDetail: cardDetail,
		errorMessage: "",
	});
};

exports.getCardList = async (req, res, next) => {
	// const userId = "6305efe8c4f33170a06934b2";
	const userId = req.user._id;
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
			if (
				element.TCR_CardRewardRate == "" ||
				element.TCR_CardRewardRate == null ||
				element.TCR_CardRewardRate == undefined
			) {
				element.TCR_CardRewardRate = "N/A";
			}
			if (
				element.TCR_CardBillGenDate == "" ||
				element.TCR_CardBillGenDate == null ||
				element.TCR_CardBillGenDate == undefined
			) {
				element.TCR_CardBillGenDate = "N/A";
			} else {
				element.TCR_CardBillGenDate += "th of every month";
			}
			if (
				element.TCR_CardBillDueDate == "" ||
				element.TCR_CardBillDueDate == null ||
				element.TCR_CardBillDueDate == undefined
			) {
				element.TCR_CardBillDueDate = "N/A";
			} else {
				element.TCR_CardBillDueDate += "th of every month";
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
	//const userId = "6305efe8c4f33170a06934b2";
	const userId = req.user._id;

	const cardId = req.body.cardId;
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
	const updatedBy = userId;
	const encryptedCardNumber = Crypt.encrypt(cardnumber, "public.pem");
	const encryptedCardCVV = Crypt.encrypt(cardcvv, "public.pem");

	if (cardexpirymonth < 0) {
		cardexpirymonth = 1;
	}
	if (cardexpirymonth > 12) {
		cardexpirymonth = 12;
	}
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
		let result;
		if (cardId == "") {
			result = await CardReminder.save();
		} else {
			result = await CardReminderModel.findById(cardId);
			if (result.TCR_CardCreatedBy.toString() !== userId.toString()) {
				errorMsg = "Unauthorised";
				console.log(`Inside BillController -> addCardReminder -> ${errorMsg}`);
				return;
				// return res.render("card-reminder/add-card-reminder.ejs", {
				// 	pageTitle: "Add/Edit Card Reminder",
				// 	bankList: [],
				// 	countBankList: 0,
				// 	cardId: "",
				// 	cardDetail: null,
				// 	errorMessage: ,
				// });
			}
			result.TCR_BankName = cardbankname;
			result.TCR_CardName = cardname;
			result.TCR_CardNumber = encryptedCardNumber;
			result.TCR_CardExpiryMonth = cardexpirymonth;
			result.TCR_CardExpiryYear = cardexpiryyear;
			result.TCR_CardSecretCode = encryptedCardCVV;
			result.TCR_CardRewardRate = cardrewardrate;
			result.TCR_CardCharges = cardcharges;
			result.TCR_CardLimit = cardlimit;
			result.TCR_CardBillGenDate = cardbillgendate;
			result.TCR_CardBillDueDate = cardduedate;
			result.TCR_CardCIBILReportingDate = cardcibildate;
			result.TCR_CardUpdatedBy = updatedBy;
			await result.save();
		}

		return res.status(201).redirect("/cards/card-list");
	} catch (err) {
		console.log(err);
	}
};

exports.viewCard = async (req, res, next) => {
	const cardId = req.params.cardId;
	const userId = req.user._id;
	const data = {};

	try {
		const cardDetail = await CardReminderModel.findById(cardId).populate(
			"TCR_BankName"
		);
		if (!cardDetail) {
			data.response = "error";
			data.message = "Card Not Found";
			return res.json(data);
		}
		if (cardDetail.TCR_CardCreatedBy.toString !== userId.toString) {
			console.log("Inside BillController -> viewCard =. Unauthorised");
			data.response = "error";
			data.message = "Unauthorised";
			return res.json(data);
		}
		cardDetail.TCR_CardNumber = Crypt.decrypt(
			cardDetail.TCR_CardNumber,
			"private.pem"
		);

		cardDetail.TCR_CardNumber = Helper.addHypenToCardNumber(
			cardDetail.TCR_CardNumber
		);
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

exports.exportToExcel = async (req, res, next) => {
	const userId = req.user._id;
	const data = {};
	let arrayToExportToExcel = [];
	const excelSheetArr = Helper.excelSheetArr;

	try {
		const cardDetail = await CardReminderModel.find({
			TCR_CardCreatedBy: userId,
		}).populate("TCR_BankName");
		if (cardDetail.length == 0) {
			console.log("Inside BillController -> viewCard =. Card Not Found");
			data.response = "error";
			data.message = "No Card Not Found";
			// return res.json(data);
			return res.redirect("/cards/card-list");
		}
		cardDetail.forEach(element => {
			element.TCR_CardNumber = Crypt.decrypt(
				element.TCR_CardNumber,
				"private.pem"
			);
			element.TCR_CardNumber = Helper.addHypenToCardNumber(
				element.TCR_CardNumber
			);
			element.TCR_CardSecretCode = Crypt.decrypt(
				element.TCR_CardSecretCode,
				"private.pem"
			);
			let exportDataToExcel = {
				[excelSheetArr[0]]: element.TCR_BankName.TBM_BankName,
				[excelSheetArr[1]]: element.TCR_CardName,
				[excelSheetArr[2]]: element.TCR_CardNumber,
				[excelSheetArr[3]]:
					element.TCR_CardExpiryMonth + "/" + element.TCR_CardExpiryYear,
				[excelSheetArr[4]]: element.TCR_CardSecretCode,
				[excelSheetArr[5]]: element.TCR_CardLimit,
				[excelSheetArr[6]]: element.TCR_CardCharges,
				[excelSheetArr[7]]: element.TCR_CardRewardRate,
				[excelSheetArr[8]]: element.TCR_CardBillGenDate,
				[excelSheetArr[9]]: element.TCR_CardBillDueDate,
				[excelSheetArr[10]]: element.TCR_BankName.TBM_BankName,
			};
			arrayToExportToExcel.push(exportDataToExcel);
		});

		const filePath = await Helper.exportToExcel(
			arrayToExportToExcel,
			"Credit Card Details",
			res
		);
		//console.log(filePath);
		// return;
		//if (result.response) {
		// if (result) {
		data.response = "success";
		data.message = "Card Found";
		// let fileDeleted;
		// if (filePath != "") {
		// 	fileDeleted = await Helper.deleteFileFromStorage(filePath);
		// }
		// console.log(fileDeleted);
		setTimeout(() => {
			return res.redirect("/cards/card-list");
		}, 10000);

		// } else {
		// 	data.response = "fail";
		// 	data.message = "Card Found but still problem";
		// 	console.log("Problem Occured" + data.message);
		// }
	} catch (err) {
		console.log(err);
		data.response = "error";
		data.message = "Server Error";
		// return res.json(data);
		return res.redirect("/cards/card-list");
	}
};

exports.deleteCard = async (req, res, next) => {
	const cardId = req.params.cardId;

	const userId = req.user._id;
	const data = {};
	try {
		const cardDetail = await CardReminderModel.findById(cardId);
		if (!cardDetail) {
			data.response = "error";
			data.message = "Card Not Found";
			return res.json(data);
			// return res.redirect("/cards/card-list");
		}
		if (cardDetail.TCR_CardCreatedBy.toString !== userId.toString) {
			console.log("Inside BillController -> deleteCard =. Unauthorised");
			return;
		}
		const result = await CardReminderModel.findByIdAndDelete(cardId);

		data.response = "success";
		data.message = "Card Deleted";
		return res.json(data);
	} catch (err) {
		data.response = "error";
		data.message = err;
		return res.json(data);
	}
};
