/**
 * Created by abe on 3/19/15.
 */
var crypto = require('crypto');
var Q = require('q');


var random = Q.denodeify(crypto.randomBytes);

function run () {
    var deferred = Q.defer();

    require('crypto').randomBytes(256, function(err, buf){
        console.log(buf.toString('hex'));
    });

    return deferred.promise;
}

run().then(function(data){
    module.exports.secret = data;
}).catch(function(err){
    throw err;
});



