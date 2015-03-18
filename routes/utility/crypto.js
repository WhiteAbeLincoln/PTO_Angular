/**
 * Created by abe on 3/17/15.
 */
var Q = require('q');
var crypto = require('crypto');

module.exports.pbkdf2 = function(password, salt) {

    var pbkdf2 = Q.denodeify(crypto.pbkdf2);

    return pbkdf2(password, salt, 4096, 512, 'sha512')
};

module.exports.createSalt = Q.denodeify(crypto.randomBytes);

