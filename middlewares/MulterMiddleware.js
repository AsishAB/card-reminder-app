// Since this is a Middleware, it is used in the "routes" folder

const multer = require("multer");
const fileLocation = "public/file_uploads/";

const storageProfile = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, fileLocation + "profile_image/");
	},
	filename: (req, file, cb) => {
		let splitted_name = file.originalname.split(".");
		let name1 = splitted_name[0].toLowerCase().split(" ").join("-");
		let name2 = splitted_name[1].toLowerCase(); //The file extension

		const full_file_name = name1 + Date.now() + "." + name2;
		cb(null, full_file_name);
	},
});

const storageBankImage = multer.diskStorage({
	destination: (req, file, cb) => {
		//console.log(file);
		cb(null, fileLocation + "bank_images/");
	},
	filename: (req, file, cb) => {
		let splitted_name = file.originalname.split(".");
		let name1 = splitted_name[0].toLowerCase().split(" ").join("-");
		let name2 = splitted_name[1].toLowerCase();

		const full_file_name = name1 + Date.now() + "." + name2;
		cb(null, full_file_name);
	},
});

const multerMiddleware = storageOption => {
	// console.log(storageOption);
	if (storageOption == "profile") {
		return multer({ storage: storageProfile }).any();
	} else if (storageOption == "bankImage") {
		// console.log(multer.diskStorage());
		// console.log("Inside MulterMiddleware");
		return multer({ storage: storageBankImage }).single("bankImage");
		// return multer({storage: storageProduct});
	}
};
// app.use(express.static(path.join(__dirname,"public")));

module.exports = multerMiddleware;
