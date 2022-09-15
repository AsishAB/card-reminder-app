const User = require("../models/UserModel");
const CardReminderModel = require("../models/EWalletModel");
const BankAccountModel = require("../models/BankAccountModel");
// const ResetPassword = require("../models/ResetPasswordModel");
const argon2 = require("argon2");
const crypto = require("crypto"); //Default Node JS package; used to generate toekn for password-reset, etc.
// const globalURL = require("../helpers/secret-files-gitallow/global-url");
// const nodemailer = require("nodemailer");
// const sendGridTransport = require("nodemailer-sendgrid-transport");
// const sendGridAPIKey = require("../helpers/secret-data/sendgrid_api");
// const sendEMail = require("../helpers/secret-data/personal-email");
const Validation = require("../helpers/helpers/validation");
const UserModel = require("../models/UserModel");
const serverSideRecaptchaScript =
	require("../helpers/gitignores/recaptcha-secret").serverSideRecaptchaScript;
const fetch = require("node-fetch");
// const transporter = nodemailer.createTransport(
// 	sendGridTransport({
// 		auth: {
// 			api_key: sendGridAPIKey,
// 		},
// 	})
// );

exports.getRegisterPage = (req, res, next) => {
	//const isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false;

	if (req.session.isLoggedIn) {
		return res.status(403).redirect("/users/dashboard");
	}
	res.render("users/register-user.ejs", {
		pageTitle: "Register New User",
		errorMessage: "",
		validationErrors: [],
		oldInput: {
			firstName: "",
			lastName: "",
			emailId: "",
			phoneNo: "",
		},
	});
};

exports.getRegisterPageForAdmin = async (req, res, next) => {
	//const isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false;
	const user = req.user._id;
	const userDetail = await UserModel.findById(user);
	if (userDetail.TUM_Role !== "admin") {
		console.log(
			"Inside UserController -> getRegisterPageForAdmin -> Only Admins can enter"
		);
		return res.status(403).redirect("/users/dashboard");
	}
	res.render("users/register-user-admin.ejs", {
		pageTitle: "Register Admin",
		errorMessage: "",
		validationErrors: [],
		oldInput: {
			firstName: "",
			lastName: "",
			emailId: "",
			phoneNo: "",
		},
	});
};
exports.registerUser = async (req, res, next) => {
	//console.log(req.body);
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const emailId = req.body.emailId;
	const phoneNo = req.body.phoneNo;
	const password = req.body.password;
	const userRole = req.body.userRole != "" ? req.body.userRole : "customer";
	const confirm_password = req.body.confirm_password;
	const validationError = [];
	var errorMsg = "";

	const recaptchaCode = req.body["g-recaptcha-response"];
	const secret_key = serverSideRecaptchaScript;
	let captchaValidation = "";
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${recaptchaCode}`;
	const googleResponse = await fetch(url, {
		method: "post",
	});
	const google_response = await googleResponse.json();

	if (!google_response.success) {
		// If google_response.success is false
		validationError.push("Invalid Captcha.");
	}
	if (Validation.blankValidation(firstName)) {
		validationError.push("First name cannot be blank");
		//return false;
	}

	if (Validation.blankValidation(lastName)) {
		validationError.push("Last Name cannot be blank");
		//return false;
	}

	if (Validation.blankValidation(emailId)) {
		validationError.push("Email Id cannot be blank");
		//return false;
	}

	if (emailId && !Validation.checkEmailId(emailId)) {
		validationError.push(
			"The Email Id format is not correct. Accepted Format - example@example.com"
		);
	}

	if (Validation.blankValidation(phoneNo)) {
		validationError.push("Mobile Number cannot be blank");
		//return false;
	}

	if (phoneNo && Validation.checkMobileNumberIN(phoneNo)) {
		validationError.push(
			"The mobile number format is not correct. Please enter a 10-digit mobile number"
		);
	}

	if (Validation.blankValidation(password)) {
		validationError.push("Password cannot be blank");
	}

	if (Validation.blankValidation(confirm_password)) {
		validationError.push("Confirm Password cannot be blank");
	}

	if (
		password &&
		confirm_password &&
		Validation.checkPasswordConfPasswordMatch(password, confirm_password)
	) {
		validationError.push("Password and Confirm Password must match");
	}

	if (validationError.length > 0) {
		return res.status(422).render("users/register-user.ejs", {
			pageTitle: "Register New User",
			errorMessage: errorMsg,
			validationErrors: validationError,
			oldInput: {
				firstName: firstName,
				lastName: lastName,
				emailId: emailId,
				phoneNo: phoneNo,
				password: password,
				confirm_password: confirm_password,
			},
		});
	}

	//console.log(firstName+" "+lastName+" "+emailId+" "+phoneNo+" "+password+" "+confirm_password);
	User.find({ $or: [{ TUM_Email: emailId }, { TUM_MobileNo: phoneNo }] })
		.then(result => {
			if (result.length != 0) {
				errorMsg =
					"User" +
					TUM_Email +
					" or " +
					TUM_MobileNo +
					" already exists. Please login";
				return res.status(422).render("users/login-user.ejs", {
					pageTitle: "Login User",
					errorMessage: errorMsg,
					validationErrors: [],
					oldInput: {
						username: userId,
						password: password,
					},
				});
			} else {
				argon2
					.hash(confirm_password)
					.then(hashedPassword => {
						const user = new User({
							TUM_FirstName: firstName,
							TUM_LastName: lastName,
							TUM_Email: emailId,
							TUM_MobileNo: phoneNo,
							TUM_Password: hashedPassword,
							TUM_Role: userRole,
						});
						user
							.save()
							.then(() => {
								console.log("Inside UserController -> registerUser");
								console.log("User has been successfully registered");
								if (userRole !== "admin") {
									return res.redirect("/users/login");
								} else {
									return res.redirect("/users/dashboard");
								}

								// return transporter.sendMail({
								// 	to: sendEMail.sendTo,
								// 	from: "asish24in@gmail.com",
								// 	subject: "Registration Successful",
								// 	html: "<h1> Your Registration Is Succesful </h1>",
								// });
							})
							// .then(() => {
							// 	console.log("Inside UserController -> registerUser");
							// 	console.log("User has been successfully registered");
							// 	if (userRole !== "admin") {
							// 		return res.redirect("/users/login");
							// 	} else {
							// 		return res.redirect("/users/dashboard");
							// 	}
							// })
							.catch(err => {
								const error = new Error(err);
								error.httpStatusCode = 500;
								return next(error);
							});
					})
					.catch(err => {
						//console.log("Inside UserController.js");
						//console.log(err);
						const error = new Error(err);
						error.httpStatusCode = 500;
						return next(error);
					});
			}
		})
		.catch(err => {
			// console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getLoginPage = (req, res, next) => {
	if (req.session.isLoggedIn) {
		return res.status(403).redirect("/users/dashboard");
	}
	res.render("users/login-user.ejs", {
		pageTitle: "Login User",
		validationErrors: [],
		errorMessage: "",
	});
};
exports.loginUser = async (req, res, next) => {
	const validationError = [];
	var errorMsg = "";
	const userId = req.body.username;
	const password = req.body.password;

	if (Validation.blankValidation(userId)) {
		validationError.push("User Id cannot be blank");
		//return false;
	}

	if (
		userId != "" &&
		!(Validation.checkEmailId(userId) || Validation.checkMobileNumberIN(userId))
	) {
		validationError.push(
			"The User Id format is not correct. Accepted Format - example@example.com or a 10-digit mobile number"
		);
		//return false;
	}
	if (Validation.blankValidation(password)) {
		validationError.push("Password cannot be blank");
		//return false;
	}

	if (validationError.length > 0) {
		return res.status(422).render("users/login-user.ejs", {
			pageTitle: "Login User",
			errorMessage: errorMsg,
			validationErrors: validationError,
			oldInput: {
				username: userId,
				password: password,
			},
		});
	}

	User.findOne({ $or: [{ TUM_Email: userId }, { TUM_MobileNo: userId }] })
		.then(result => {
			//console.log(result);
			if (!result) {
				errorMsg = "No User Found";
				//req.flash('error',errorMsg[0]);
				return res.status(422).render("users/login-user.ejs", {
					pageTitle: "Login User",
					errorMessage: errorMsg,
					validationErrors: [],
					oldInput: {
						username: userId,
						password: password,
					},
				});
			} else {
				argon2
					.verify(result.TUM_Password, password)
					.then(doMatch => {
						if (doMatch) {
							req.session.isLoggedIn = true;
							req.session.isUserRole = result.TUM_Role;

							req.session.user = result;
							req.session.save(err => {
								if (err) {
									console.log("Inside UserController -> loginUser");

									console.log(err);
									return res.redirect("/users/login");
								}
								return res.redirect("/users/dashboard");
							});
						} else {
							errorMsg = "Entered Password is wrong";
							//req.flash('error', errorMsg);
							return res.status(422).render("users/login-user.ejs", {
								pageTitle: "Login User",
								errorMessage: errorMsg,
								validationErrors: [],
								oldInput: {
									username: userId,
									password: "",
								},
							});
						}
					})
					.catch(err => {
						const error = new Error(err);
						error.httpStatusCode = 500;
						return next(error);
						//console.log(err);
					});
			}
		})
		.catch(err => {
			// console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.logoutUser = (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		}
		res.redirect("/users/login");
	});
};

exports.getDashboard = async (req, res, next) => {
	const userId = req.user._id;
	const user = await User.findById(userId);

	let userName;

	// userName = user.TUM_FirstName + " " + user.TUM_LastName;
	userName = user.TUM_FirstName;

	const cardDetail = await CardReminderModel.find({
		TCR_CardCreatedBy: userId,
	});
	const bankAccountDetail = await BankAccountModel.find({
		TBAM_CreatedBy: userId,
	});

	let totalLimit = 0;
	let totalCardCharges = 0;
	let totalBankAccounts = bankAccountDetail.length;

	const cardSubDetails = {};
	cardSubDetails.totalCards = cardDetail.length;
	for (let i = 0; i < cardDetail.length; i++) {
		totalLimit += Number(cardDetail[i].TCR_CardLimit);
	}
	cardSubDetails.totalLimit = totalLimit;
	for (let i = 0; i < cardDetail.length; i++) {
		totalCardCharges += Number(cardDetail[i].TCR_CardCharges);
	}
	cardSubDetails.totalChargesForCard = totalCardCharges;
	//const latestBillDate = ;

	res.render("users/dashboard.ejs", {
		pageTitle: "Dashboard",
		cardSubDetails: cardSubDetails,
		userName: userName,
		totalBankAccounts: totalBankAccounts,
	});
};
