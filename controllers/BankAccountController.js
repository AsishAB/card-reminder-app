const User = require("../models/UserModel");
const BankAccountModel = require("../models/BankAccountModel");
const BankModel = require("../models/BankModel");
const argon2 = require("argon2");
const crypto = require("crypto"); //Default Node JS package; used to generate toekn for password-reset, etc.
const Validation = require("../helpers/helpers/validation");
const Crypt = require("../helpers/encrypt_decrypt/encryptDecryptText");
// const globalURL = require("../helpers/secret-files-gitallow/global-url");
// const nodemailer = require("nodemailer");
// const sendGridTransport = require("nodemailer-sendgrid-transport");
// const sendGridAPIKey = require("../helpers/secret-data/sendgrid_api");
// const sendEMail = require("../helpers/secret-data/personal-email");

exports.getBankAccountList = async (req, res, next) => {
	const userId = req.user._id;
	const bankAccountDetails = await BankAccountModel.find({
		TBAM_CreatedBy: userId,
	})
		.populate("TBAM_BankName")
		.populate("TBAM_CreatedBy");
	bankAccountDetails.forEach(element => {
		element.BankAccountNumber = Crypt.decrypt(
			element.TBAM_AccountNumber,
			"private-bankacc.pem"
		);
		element.action = `
				<button class="btn border border-success text-success" onclick="viewCard('${element._id}')"> <i class="fa-solid fa-eye"></i> 
				</button>&nbsp;
				<a href="/cards/edit-card/${element._id}" class="btn border border-primary text-primary"><i class="fas fa-edit"></i></a> &nbsp;
				<button class="btn border border-danger text-danger" onclick="deleteCard('${element._id}')"> <i class="fa-solid fa-trash-can"></i> </button>`;
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

	const bankAccountDetail = new BankAccountModel({
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
	try {
		const result = await bankAccountDetail.save();
		if (result) {
			res.status(201).redirect("/bankaccount/bankaccount-list");
		} else {
			res.status(500).redirect("/bankaccount/add-bankaccount");
		}
	} catch (err) {
		console.log(err);
	}
};
