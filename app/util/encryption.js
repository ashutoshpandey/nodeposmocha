var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};

/**
 * Encrypts a string
 * @param {string} string - String to be encrypted
 * @returns {string}
 */
function encrypt(string){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(string,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * Decrypts and returns a given string
 * @param {string} string - String to be decrypted
 * @returns {string}
 */
function decrypt(string){
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(string,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}
