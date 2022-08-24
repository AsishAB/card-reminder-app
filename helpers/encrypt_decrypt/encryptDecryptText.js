// https://stackoverflow.com/questions/54087514/asymmetric-encryption-using-nodejs-crypto-module //

var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
const passphrase = "mySecret";

exports.encrypt = (toEncrypt, relativeOrAbsolutePathToPublicKey) => {
	var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
	var publicKey = fs.readFileSync(absolutePath, "utf8");
	var buffer = Buffer.from(toEncrypt);
	var encrypted = crypto.publicEncrypt(publicKey, buffer);
	return encrypted.toString("hex");
};

exports.decrypt = (toDecrypt, relativeOrAbsolutePathtoPrivateKey) => {
	var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
	var privateKey = fs.readFileSync(absolutePath, "utf8");
	var buffer = Buffer.from(toDecrypt, "hex");
	const decrypted = crypto.privateDecrypt(
		{
			key: privateKey.toString(),
			passphrase: passphrase,
		},
		buffer
	);
	return decrypted.toString("utf8");
};

const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");

function generateKeys() {
	const { publicKey, privateKey } = generateKeyPairSync("rsa", {
		modulusLength: 4096,
		namedCurve: "secp256k1",
		publicKeyEncoding: {
			type: "spki",
			format: "pem",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem",
			cipher: "aes-256-cbc",
			passphrase: passphrase,
		},
	});

	writeFileSync("private.pem", privateKey);
	writeFileSync("public.pem", publicKey);
}

if (!(fs.existsSync("private.pem") && fs.existsSync("public.pem"))) {
	generateKeys();
}

// https://stackoverflow.com/questions/54087514/asymmetric-encryption-using-nodejs-crypto-module //
