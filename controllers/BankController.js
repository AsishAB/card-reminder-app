const BankModel = require("../models/BankModel");
const globalURL = require("../helpers/global-url").globalURL;

exports.getBankList = async (req, res, next) => {
	const bankDetails = await BankModel.find();
	const countBankDetails = await BankModel.find().countDocuments();

	bankDetails.forEach(element => {
		element.TBM_BankImage = globalURL + element.TBM_BankImage;
	});
	res.render("bank/bank-list.ejs", {
		pageTitle: "Bank List",
		bankDetails: bankDetails,
		countBankDetails: countBankDetails,
	});
};

exports.getAddBank = (req, res, next) => {
	res.render("bank/add-bank.ejs", {
		pageTitle: "Add/Edit Bank",
	});
};
exports.addBank = async (req, res, next) => {
	const bankName = req.body.bankName;
	const bankImage = req.file;
	const userId = "6305efe8c4f33170a06934b2";

	let fileName = bankImage ? "bank_images/" + bankImage.filename : "";

	const bankDetail = new BankModel({
		TBM_BankName: bankName,
		TBM_BankImage: fileName,
		TBM_CreatedBy: userId,
	});

	try {
		const result = await bankDetail.save();
		if (result) {
			res.status(201).redirect("/bank/bank-list");
		} else {
			res.status(500).redirect("/bank/add-bank");
		}
	} catch (err) {
		console.log(err);
	}
};
