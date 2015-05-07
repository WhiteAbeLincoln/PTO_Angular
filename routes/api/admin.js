var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
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