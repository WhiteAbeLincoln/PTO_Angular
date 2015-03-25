/**
 * Created by abe on 3/17/15.
 */
var Q = require('q');
var crypto = require('crypto');


/**
 * A pbkdf2 promise
 *
 * @promise Pbkdf2
 * @fulfill {Buffer} a buffer containing the hashed key
 * @reject {Error}
 */

/**
 * Delete a file, or a directory and all sub-files, from the zip
 * @param {string} password the desired password to hash
 * @param {string} salt the salt to hash with
 * @returns {Pbkdf2} a promise for the hashed key
 */
module.exports.pbkdf2 = function(password, salt) {

    var pbkdf2 = Q.denodeify(crypto.pbkdf2);

    return pbkdf2(password, salt, 4096, 512, 'sha512')
};

/**
 * A promise for salt
 * @promise Salt
 * @fulfill {Buffer} a buffer containing the bytes
 * @reject {Error} if all entropy sources are drained
 */

/**
 * Creates a salt from cryptographically secure bytes
 * @param {number} size of the salt in bytes e.g 256, 512
 * @returns {Salt} a promise for the salt
 */
module.exports.createSalt = Q.denodeify(crypto.randomBytes);

