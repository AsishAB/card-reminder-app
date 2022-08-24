const User = require("../models/UserModel");
// const ResetPassword = require("../models/ResetPasswordModel");
const argon2 = require("argon2");
const crypto = require("crypto"); //Default Node JS package; used to generate toekn for password-reset, etc.
// const globalURL = require("../helpers/secret-files-gitallow/global-url");
// const nodemailer = require("nodemailer");
// const sendGridTransport = require("nodemailer-sendgrid-transport");
// const sendGridAPIKey = require("../helpers/secret-data/sendgrid_api");
// const sendEMail = require("../helpers/secret-data/personal-email");
//const Validation = require("../helpers/validation/validation");

// const transporter = nodemailer.createTransport(
// 	sendGridTransport({
// 		auth: {
// 			api_key: sendGridAPIKey,
// 		},
// 	})
// );

exports.getRegisterPage = (req, res, next) => {
	//const isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false;

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

exports.registerUser = (req, res, next) => {
	//console.log(req.body);
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const emailId = req.body.emailId;
	const phoneNo = req.body.phoneNo;
	const password = req.body.password;
	const confirm_password = req.body.confirm_password;
	const validationError = [];
	var errorMsg = "";

	// if (Validation.blankValidation(firstName)) {
	// 	validationError.push("First name cannot be blank");
	// 	//return false;
	// }

	// if (Validation.blankValidation(lastName)) {
	// 	validationError.push("Last Name cannot be blank");
	// 	//return false;
	// }

	// if (Validation.blankValidation(emailId)) {
	// 	validationError.push("Email Id cannot be blank");
	// 	//return false;
	// }

	// if (emailId && Validation.checkEmailId(emailId)) {
	// 	validationError.push(
	// 		"The Email Id format is not correct. Accepted Format - example@example.com"
	// 	);
	// }

	// if (Validation.blankValidation(phoneNo)) {
	// 	validationError.push("Mobile Number cannot be blank");
	// 	//return false;
	// }

	// if (phoneNo && Validation.checkMobileNumberIN(phoneNo)) {
	// 	validationError.push(
	// 		"The mobile number format is not correct. Please enter a 10-digit mobile number"
	// 	);
	// }

	// if (Validation.blankValidation(password)) {
	// 	validationError.push("Password cannot be blank");
	// }

	// if (Validation.blankValidation(confirm_password)) {
	// 	validationError.push("Confirm Password cannot be blank");
	// }

	// if (
	// 	password &&
	// 	confirm_password &&
	// 	Validation.checkPasswordConfPasswordMatch(password, confirm_password)
	// ) {
	// 	validationError.push("Password and Confirm Password must match");
	// }

	// if (validationError.length > 0) {
	// 	return res.status(422).render("users/register-user.ejs", {
	// 		pageTitle: "Register New User",
	// 		errorMessage: errorMsg,
	// 		validationErrors: validationError,
	// 		oldInput: {
	// 			firstName: firstName,
	// 			lastName: lastName,
	// 			emailId: emailId,
	// 			phoneNo: phoneNo,
	// 			password: password,
	// 			confirm_password: confirm_password,
	// 		},
	// 	});
	// }

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
							TUM_Role: "customer",
						});
						user
							.save()
							.then(() => {
								console.log("Inside UserController -> registerUser");
								console.log("User has been successfully registered");
								res.redirect("/users/login");
								// return transporter.sendMail({
								// 	to: sendEMail.sendTo,
								// 	from: "asish24in@gmail.com",
								// 	subject: "Registration Successful",
								// 	html: "<h1> Your Registration Is Succesful </h1>",
								// });
							})
							.then(() => {
								console.log("Inside UserController -> registerUser");
								console.log("User has been successfully registered");
								res.redirect("/user/login");
							})
							.catch(err => {
								//console.log("Inside UserController.js");
								// console.log(err);
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
