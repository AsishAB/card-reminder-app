// const { Result } = require("express-validator");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const date = new Date();
const current_date =
	date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate();
const current_time =
	date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
const date_time = current_date + "_" + current_time;

exports.date_time = date_time;

const excelSheetArr = [
	"Bank Name",
	"Card Name",
	"Card Number",
	"Card Expiry Date (MM/YY)",
	"Card CVV",
	"Card Limit",
	"Card Charges",
	"Reward Rate",
	"Card Bill Generation Date",
	"Card Bill Due Date",
	"Card Charges",
];

exports.excelSheetArr = excelSheetArr;

const excelSheetArrForBankAccount = [
	"Bank Name",
	"Account Number",
	"IFSC Code",
	"Internet Banking Username",
	"Internet Banking Password",
	"Number of Credit Cards with this bank",
	"Toll free Numbers or Other Contact numbers",
	"Email Ids for the Bank",
];

exports.excelSheetArrForBankAccount = excelSheetArrForBankAccount;

const deleteFileFromStorage = (filePath = "") => {
	// console.log("Inside helpers -> deleteFileFromStorage " + filePath);
	fs.unlink(`${filePath}`, err => {
		// fs.unlink(fileStorage, err => {
		if (err) {
			console.log(err);
			return { response: err, response: false };
		}
	});
	return { response: "success", response: true };
};
exports.deleteFileFromStorage = deleteFileFromStorage;

exports.exportToExcel = async (data, fileNameFromController, res, next) => {
	let dataToWriteToExcelSheet = data;
	const ws = xlsx.utils.json_to_sheet(dataToWriteToExcelSheet);
	const wb = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(wb, ws, "Responses");
	let i = 0;
	// let writeFile = true;
	let fileName = fileNameFromController + "_" + date_time + ".xlsx";
	try {
		xlsx.writeFile(wb, fileName);
	} catch (err) {
		console.error(err);
	}
	let downloadLink = `${fileName}`;
	res.status(200).download(downloadLink, async err => {
		if (err) {
			console.log("Cannot download the file \n", err);
		} else {
			deleteFileFromStorage(downloadLink);
		}
	});

	return;
};
exports.addHypenToCardNumber = cardNumber => {
	cardNumber = addZeroes(cardNumber);
	let totalLengthofCardNumber = cardNumber.length;
	let separatedCardNumber = [];
	let splitValue;
	let spValue = 4;
	splitValue = spValue;

	let endOfLoop = totalLengthofCardNumber / splitValue;

	for (let i = 0; i < endOfLoop; i++) {
		totalLengthofCardNumber = totalLengthofCardNumber - spValue;

		let splittedCardValue = cardNumber.substr(totalLengthofCardNumber, spValue);
		separatedCardNumber.push(splittedCardValue);
		splitValue += spValue;
	}
	separatedCardNumber = reverseArray(separatedCardNumber);
	separatedCardNumber = separatedCardNumber.toString().replace(/,/g, "-");
	return separatedCardNumber;
};
const addZeroes = (string = "") => {
	const fixedLength = 16;
	let length = string.length;
	const loopCount = fixedLength - length;

	for (let i = 0; i < loopCount; i++) {
		string = "0" + string;
	}
	return string;
};
exports.addZeroes = addZeroes;

const reverseArray = (array = []) => {
	let newArray = [];

	for (let i = array.length - 1; i >= 0; i--) {
		newArray.push(array[i]);
	}
	return newArray;
};

exports.reverseArray = reverseArray;
exports.reverseString = (string = "") => {
	let newString;
	let j = 0;
	for (let i = string.length - 1; i >= 0; i--) {
		newString[j] = string[i];
		j++;
	}
	return newString;
};

//Check sqlinjection
exports.checkSqlInjection = (string = "", mysql_real_escape = true) => {
	if (mysql_real_escape) {
		string = string.replace(
			["\\", "\0", "\n", "\r", "'", '"', "\x1a"],
			["\\\\", "\\0", "\\n", "\\r", "\\'", '\\"', "\\Z"]
		);
	}
	return string;
};

exports.getStatusNameLogo = () => {
	// $result = DB::table('tbl_status_mstr')
	//         ->select('TSM_Status','TSM_Status_Name', 'TSM_Status_Name_Odia','TSM_Status_Logo')
	//         ->where('TSM_Status_DeletedFlag', '=', false)
	//         ->get();
	// foreach($result as $val){
	//     $resArr[$val->TSM_Status_Name]=$val->TSM_Status_Logo;
	// }
	// return !empty($resArr) ? $resArr :array();
};

exports.getAssignedUserInfo = userId => {
	// result = DB::table('tbl_user_mstr as tum')
	//         ->select('tum.TUM_User as userid', 'tum.TUM_User_Email as useremail', 'tum.TUM_User_Mobile as usermobile',DB::raw("(CONCAT(tum.TUM_User_Name,' ',tum.TUM_User_Lname)) as username"))
	//         ->where('tum.TUM_User', '=', $userId)
	//         ->where('tum.TUM_User_DeletedFlag', '=', 0)
	//         ->where('tum.TUM_User_Status', '=', 1)
	//         ->get();

	return result;
};
