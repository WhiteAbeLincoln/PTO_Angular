var express = require('express');
var router = express.Router();
var myCrypt = require('../utility/crypto.js');
var Server = require('../utility/server.js');
var moment = require('moment');
var db = new Server();

router.post('/login', function(req, res){

    db.admin.query([req.body.username]).then(function(data){
        if (data[0].length == 0){       //if there is no user with that username
            res.status(401).send('Incorrect username or password');
            return;
        }
        var user = data[0][0];

        return myCrypt.pbkdf2(req.body.password, user.salt).then(function(key){
            if (user.password === key.toString('base64')){            //correct password
                var profile = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    type: user.type,
                    id: user.adminId,
                    registrationDate: user.registrationDate
                };
                var token = jwt.sign(profile, mySecret);

                res.json({token:token, user: profile});
            } else {
                res.status(401).send('Incorrect password or username');
            }
        });
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/me', function(req, res){
    res.send(req.user);
});

router.get('/user/:name', function(req, res){
    db.admin.query([req.params.name]).then(function(data){
        var user = data[0][0];

        var profile = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            type: user.type,
            id: user.adminId,
            registrationDate: user.registrationDate
        };

        res.json(profile);
    }).catch(function(err){
        console.log(err);
        res.sendStatus(err.status);
    })
});


router.post('/register', function(req, res){
    myCrypt.createSalt(512).then(function(data){
        var salt = data.toString('base64');
        return myCrypt.pbkdf2(req.body.password, salt)
            .then(function(key){
                return db.admin.create([
                    req.body.firstName, req.body.lastName,      req.body.email, req.body.type,
                    req.body.username,  key.toString('base64'), salt,           moment().format("YYYY-MM-DD HH:mm:ss")
                ]);

            });
    }).then(function(data){
        //console.log(data);
        res.json(req.body);
    }).catch(function(err){
        if (err) console.log(err);
    })
});

module.exports = router;