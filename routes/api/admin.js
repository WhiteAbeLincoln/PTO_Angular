var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var mySecret = require('../utility/secret.js');
var myCrypt = require('../utility/crypto.js');
var Server = require('../utility/server.js');
var moment = require('moment');
var db = new Server('admin');

router.post('/login', function(req, res, next){
    validateUser(req.body.username, req.body.password, function(user) {
        var profile = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            type: user.type,
            registrationDate: user.registrationDate
        };
        var token = jwt.sign(profile, mySecret);

        res.json({token:token, user: profile});
    }, function(err) {
        if (err.status == 404) {
            res.status(401).send('Incorrect username or password');
        } else if (err.status == 401) {
            res.status(401).send('Incorrect username or password');
        } else {
            return next(err);
        }
    });
});

router.get('/me', expressJwt({secret: mySecret}), function(req, res) {
    res.send(req.user);
});

// since this is hidden behind the secret key, we already know who the user is, and that they are valid
router.put('/me', expressJwt({secret: mySecret}), function(req, res, next) {
    var validKeys = ["firstName", "lastName", "email", "password"];
    var body = req.body;
    var updateObj = {};
    var user = req.user;        // this is the user

    validKeys.forEach(function(key) {
        if (body[key]) {
            updateObj[key] = body[key];
        }
    });

    if (updateObj.password) {
        myCrypt.createSalt(512).then(function(data) {
            updateObj.salt = data.toString('base64');
            return myCrypt.pbkdf2(updateObj.password, updateObj.salt)
        }).then(function (key) {
            updateObj.password = key.toString('base64');
            return db.admin.update([updateObj, user.username])
        }).then(function(data) {
            res.status(204).send();
        }).catch(function(err) {
            if (err) return next(err);
        });
    } else {
        db.admin.update([updateObj, user.username]).then(function(data) {
            res.status(204).send();
        }).catch(function(err) {
            if (err) return next(err);
        });
    }
});

router.delete('/me', expressJwt({secret: mySecret}), function(req, res, next) {
    var user = req.user;
    db.admin.delete([user.username]).then(function(data) {
        res.status(204).send();
    }).catch(function(err) {
        if (err) return next(err);
    })
});

router.get('/user/:uname', function(req, res, next){
    db.admin.query([req.params.uname]).then(function(data) {
        if (data[0].length) {
            var user = data[0][0];

            var profile = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                type: user.type,
                registrationDate: user.registrationDate
            };

            res.json(profile);
        } else {
            res.status(404).send();
        }
    }).catch(function(err) {
        if (err) return next(err);
    })
});

router.post('/register', expressJwt({secret: mySecret}), function(req, res, next) {
    myCrypt.createSalt(512).then(function(data) {
        var salt = data.toString('base64');
        return myCrypt.pbkdf2(req.body.password, salt)
            .then(function(key){
                return db.admin.create([
                    req.body.firstName, req.body.lastName,      req.body.email, req.body.type,
                    req.body.username,  key.toString('base64'), salt,           moment().format("YYYY-MM-DD HH:mm:ss")
                ]);

            });
    }).then(function(data){
        res.json(req.body);
    }).catch(function(err){
        if (err) return next(err);
    })
});

function validateUser(username, password, valid, invalid) {
    db.admin.query([username]).then(function(data){
        if (data[0].length == 0) {       //if there is no user with that username
            var error = new Error('user doesn\'t exist');
            error.status = 404;
            return invalid(error);
        }
        var user = data[0][0];

        return myCrypt.pbkdf2(password, user.salt).then(function(key){
            if (user.password === key.toString('base64')) {            //correct password
                return valid(user);
            } else {
                var error = new Error('invalid password');
                error.status = 401;
                return invalid(error);
            }
        });
    }).catch(function(err){
        if (err) return invalid(err);
    });
}

module.exports = router;