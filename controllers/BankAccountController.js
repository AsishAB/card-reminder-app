const User = require("../models/UserModel");
const BankAccountModel = require("../models/BankAccountModel");
const BankModel = require("../models/BankModel");
const argon2 = require("argon2");
const crypto = require("crypto"); //Default Node JS package; used to generate toekn for password-reset, etc.
const Validation = require("../helpers/helpers/validation");
const Crypt = require("../helpers/encrypt_decrypt/encryptDecryptText");
const Helper = require("../helpers/helpers/helper");
const globalURL = require("../helpers/global-url").globalURL;
// const nodemailer = require("nodemailer");
// const sendGridTransport = require("nodemailer-sendgrid-transport");
// const sendGridAPIKey = require("../helpers/secret-data/sendgrid_api");
// const sendEMail = require("../helpers/secret-data/personal-email");

exports.getBankAccountList = async (req, res, next) => {
	const userId = req.user._id;
	const bankAccountDetails = await BankAccountModel.find({
		TBAM_CreatedBy: userId,
	}).populate("TBAM_BankName");

	bankAccountDetails.forEach(element => {
		if (element.TBAM_CreatedBy.toString !== userId.toString) {
			console.log(
				"Inside BankAccountController -> getBankAccountList =. Unauthorised"
			);
			data.response = "error";
			data.message = "Unauthorised";
			return res.json(data);
		}
		element.BankAccountNumber = Crypt.decrypt(
			element.TBAM_AccountNumber,
			"private-bankacc.pem"
		);
		element.action = `
				<button class="btn border border-success text-success" onclick="viewBankAccount('${element._id}')"> <i class="fa-solid fa-eye"></i> 
				</button>&nbsp;
				<a href="/bankaccount/edit-bankaccount/${element._id}" class="btn border border-primary text-primary"><i class="fas fa-edit"></i></a> &nbsp;
				<button class="btn border border-danger text-danger" onclick="deleteBankAccount('${element._id}')"> <i class="fa-solid fa-trash-can"></i> </button>`;
	});
	const countbankAccountDetails = bankAccountDetails.length;
	res.render("bankaccounts/get-bankaccount.ejs", {
		pageTitle: "Bank Account List",
		bankAccountDetails: bankAccountDetails,
		countbankAccountDetails: countbankAccountDetails,
	});
};

exports.getAddBankAccountList = async (req, res, next) => {
	const bankList = await BankModel.find();
	const countBankList = await BankModel.find().countDocuments();
	res.render("bankaccounts/add-bankaccount.ejs", {
		pageTitle: "Add/Edit Bank Account",
		bankList: bankList,
		countBankList: countBankList,
		bankAccountDetail: [],
	});
};

exports.addBankAccount = async (req, res, next) => {
	const userId = req.user._id;

	const bankAccountId = req.body.bankAccountId;
	const bankAccountName = req.body.bankAccountName;
	const bankAccountNumber = req.body.bankAccountNumber;
	const confirmBankAccountNumber = req.body.confirmBankAccountNumber;
	const bankifsccode = req.body.bankifsccode.toUpperCase();
	const interetBankingUserName = req.body.interetBankingUserName;
	const interetBankingPassword = req.body.interetBankingPassword;
	const totalNoOfCreditCards = req.body.totalNoOfCreditCards;
	const tollFreeNumbers = req.body.tollFreeNumbers;
	const bankEmailAddress = req.body.bankEmailAddress;
	let encryptedBankAccountNumber = Crypt.encrypt(
		confirmBankAccountNumber,
		"public-bankacc.pem"
	);
	let encryptedInternetBankingUserName = Crypt.encrypt(
		interetBankingUserName,
		"public-bankacc.pem"
	);
	let encryptedInternetBankingPassword = Crypt.encrypt(
		interetBankingPassword,
		"public-bankacc.pem"
	);
	try {
		let result, bankAccountDetail;
		if (bankAccountId == "" || bankAccountId == undefined) {
			bankAccountDetail = new BankAccountModel({
				TBAM_BankName: bankAccountName,
				TBAM_AccountNumber: encryptedBankAccountNumber,
				TBAM_IFSCCode: bankifsccode,
				TBAM_InternetBankingUserName: encryptedInternetBankingUserName,
				TBAM_InternetBankingPassword: encryptedInternetBankingPassword,
				TBAM_CreditCards: totalNoOfCreditCards,
				TBAM_ContactNumbers: tollFreeNumbers,
				TBAM_ContactEmailIds: bankEmailAddress,
				TBAM_CreatedBy: userId,
			});
		} else {
			bankAccountDetail = await BankAccountModel.findById(bankAccountId);

			if (bankAccountDetail.TBAM_CreatedBy.toString !== userId.toString) {
				console.log(
					"Inside BankAccountController -> addBankAccount (POST METHOD) =. Unauthorised"
				);
				return;
			}
			bankAccountDetail.TBAM_BankName = bankAccountName;
			bankAccountDetail.TBAM_AccountNumber = encryptedBankAccountNumber;
			bankAccountDetail.TBAM_IFSCCode = bankifsccode;
			bankAccountDetail.TBAM_InternetBankingUserName =
				encryptedInternetBankingUserName;
			bankAccountDetail.TBAM_InternetBankingPassword =
				encryptedInternetBankingPassword;
			bankAccountDetail.TBAM_CreditCards = totalNoOfCreditCards;
			bankAccountDetail.TBAM_ContactNumbers = tollFreeNumbers;
			bankAccountDetail.TBAM_ContactEmailIds = bankEmailAddress;
			bankAccountDetail.TBAM_UpdatedBy = userId;
		}

		result = await bankAccountDetail.save();
		if (result) {
			res.status(201).redirect("/bankaccount/bankaccount-list");
		} else {
			res.status(500).redirect("/bankaccount/add-bankaccount");
		}
	} catch (err) {
		console.log(err);
	}
};

exports.editBankAccount = async (req, res, next) => {
	const bankAccountId = req.params.bankAccountId;
	const bankList = await BankModel.find();
	const countBankList = await BankModel.find().countDocuments();
	const userId = req.user._id;
	try {
		const bankAccountDetail = await BankAccountModel.findById(bankAccountId);
		if (!bankAccountDetail) {
			console.log(
				"Inside BankAccountController -> editBankAccount =. Bank Account Not Found"
			);
			return;
		}
		if (bankAccountDetail.TBAM_CreatedBy.toString !== userId.toString) {
			console.log(
				"Inside BankAccountController -> editBankAccount =. Unauthorised"
			);
			return;
		}
		bankAccountDetail.TBAM_AccountNumber = Crypt.decrypt(
			bankAccountDetail.TBAM_AccountNumber,
			"private-bankacc.pem"
		);
		bankAccountDetail.TBAM_InternetBankingUserName = Crypt.decrypt(
			bankAccountDetail.TBAM_InternetBankingUserName,
			"private-bankacc.pem"
		);
		bankAccountDetail.TBAM_InternetBankingPassword = Crypt.decrypt(
			bankAccountDetail.TBAM_InternetBankingPassword,
			"private-bankacc.pem"
		);
		return res.render("bankaccounts/add-bankaccount.ejs", {
			pageTitle: "Add/Edit Bank Account",
			bankList: bankList,
			countBankList: countBankList,
			bankAccountDetail: bankAccountDetail,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.viewBankAccount = async (req, res, next) => {
	const bankAccountId = req.params.bankAccountId;
	const userId = req.user._id;
	const data = {};
	const excelSheetArrForBankAccount = Helper.excelSheetArrForBankAccount;

	try {
		const bankAccountDetail = await BankAccountModel.findById(
			bankAccountId
		).populate("TBAM_BankName");

		if (!bankAccountDetail) {
			data.response = "error";
			data.message = "Bank Account Not Found";
			return res.json(data);
		}
		if (bankAccountDetail.TBAM_CreatedBy.toString !== userId.toString) {
			console.log(
				"Inside BankAccountController -> viewBankAccount =. Unauthorised"
			);
			data.response = "error";
			data.message = "Unauthorised";
			return res.json(data);
		}
		bankAccountDetail.TBAM_AccountNumber = Crypt.decrypt(
			bankAccountDetail.TBAM_AccountNumber,
			"private-bankacc.pem"
		);
		bankAccountDetail.TBAM_InternetBankingUserName = Crypt.decrypt(
			bankAccountDetail.TBAM_InternetBankingUserName,
			"private-bankacc.pem"
		);
		bankAccountDetail.TBAM_InternetBankingPassword = Crypt.decrypt(
			bankAccountDetail.TBAM_InternetBankingPassword,
			"private-bankacc.pem"
		);

		bankAccountDetail.TBAM_BankName.TBM_BankImage =
			globalURL + bankAccountDetail.TBAM_BankName.TBM_BankImage;
		data.data = bankAccountDetail;
		data.excelSheetArrForBankAccount = excelSheetArrForBankAccount;
		data.response = "success";
		data.message = "Bank Account Found";
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
	const excelSheetArrForBankAccount = Helper.excelSheetArrForBankAccount;

	try {
		const bankAccountDetail = await BankAccountModel.find({
			TBAM_CreatedBy: userId,
		}).populate("TBAM_BankName");
		if (bankAccountDetail.length == 0) {
			console.log(
				"Inside BankAccountController -> exportToExcel =. Bank Account Not Found"
			);
			data.response = "error";
			data.message = "No Bank Account Found";
			// return res.json(data);
			return res.redirect("/bankaccount/bankaccount-list");
		}
		// if (bankAccountDetail[0].TCR_CardCreatedBy.toString !== userId.toString) {
		// 	console.log("Inside BankAccountController -> exportToExcel =. Unauthorised");
		// 	return res.redirect("/bankaccount/bankaccount-list");
		// }
		bankAccountDetail.forEach(element => {
			element.TBAM_AccountNumber = Crypt.decrypt(
				element.TBAM_AccountNumber,
				"private-bankacc.pem"
			);
			element.TBAM_InternetBankingUserName = Crypt.decrypt(
				element.TBAM_InternetBankingUserName,
				"private-bankacc.pem"
			);
			element.TBAM_InternetBankingPassword = Crypt.decrypt(
				element.TBAM_InternetBankingPassword,
				"private-bankacc.pem"
			);
			let exportDataToExcel = {
				[excelSheetArrForBankAccount[0]]: element.TBAM_BankName.TBM_BankName,
				[excelSheetArrForBankAccount[1]]: element.TBAM_AccountNumber,
				[excelSheetArrForBankAccount[2]]: element.TBAM_IFSCCode,
				[excelSheetArrForBankAccount[3]]: element.TBAM_InternetBankingUserName,
				[excelSheetArrForBankAccount[4]]: element.TBAM_InternetBankingPassword,
				[excelSheetArrForBankAccount[5]]: element.TBAM_CreditCards,
				[excelSheetArrForBankAccount[6]]: element.TBAM_ContactNumbers,
				[excelSheetArrForBankAccount[7]]: element.TBAM_ContactEmailIds,
			};
			arrayToExportToExcel.push(exportDataToExcel);
		});

		const result = await Helper.exportToExcel(
			arrayToExportToExcel,
			"Bank Account Details",
			res
		);

		if (result) {
			data.response = "success";
			data.message = "Bank Account Found";
			// return res.json(data);
			return res.redirect("/bankaccount/bankaccount-list");
		}
	} catch (err) {
		console.log(err);
		data.response = "error";
		data.message = "No Bank Account Found";
		// return res.json(data);
		return res.redirect("/bankaccount/bankaccount-list");
	}
};

exports.deleteBankAccount = async (req, res, next) => {
	const bankAccountId = req.params.bankAccountId;

	const userId = req.user._id;
	const data = {};
	try {
		const bankAccountDetail = await BankAccountModel.findById(bankAccountId);
		if (!bankAccountDetail) {
			data.response = "error";
			data.message = "Bank Account Not Found";
			return res.json(data);
			// return res.redirect("/cards/card-list");
		}
		if (bankAccountDetail.TBAM_CreatedBy.toString !== userId.toString) {
			console.log(
				"Inside BankAccountController -> deleteBankAccount =. Unauthorised"
			);
			return;
		}
		const result = await BankAccountModel.findByIdAndDelete(bankAccountId);

		data.response = "success";
		data.message = "Card Deleted";
		return res.json(data);
	} catch (err) {
		data.response = "error";
		data.message = err;
		return res.json(data);
	}
};
