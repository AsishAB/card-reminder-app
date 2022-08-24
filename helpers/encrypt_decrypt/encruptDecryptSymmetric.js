const crypto = require('crypto');

const secretKeyCrypto = require('../secret-files-gitallow/secret-key-crypto');
const iv = secretKeyCrypto.iv.toString('hex');
const key = secretKeyCrypto.secret_key;
const algorithm = secretKeyCrypto.algorithm;

const encryptText = (dataToBeEncrypted) => {
    let data = String(dataToBeEncrypted);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    // let cipher = crypto.createCipheriv(algorithm, key, iv);  
    // // let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    // let encrypted =  cipher.update(String(data), 'utf8', 'hex') + cipher.final('hex');
    // //encrypted = Buffer.concat([encrypted, cipher.final()]);
    // // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    // return encrypted.toString('hex');
}

const decryptText = (encryptedData) => {
    let data = String(encryptedData);
    let decpt_iv = Buffer.from(data.iv.toString('hex'), 'hex');
    let encryptedText = Buffer.from(data.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), decpt_iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.encryptText = encryptText;

exports.decryptText = decryptText;


/*  
More details -
===============

https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs

https://stackoverflow.com/questions/6953286/how-to-encrypt-data-that-needs-to-be-decrypted-in-node-js



*/