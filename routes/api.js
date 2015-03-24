var express = require('express');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var Q = require('q');
var myCrypt = require('./utility/crypto.js');
var router = express.Router();
var Server = require('./utility/server.js');
var mime = require('mime');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var db = new Server();

router.get('/',
    function (req, res) {
        res.status(404).end();
    }
);

router.get('/downloads/', function(req, res){
    db.downloads.queryAll().then(function(data){
        var types = {};
        var array = data[0];
        for (var i in array) {      //bonus -- any downloads w/o a type will be added to an 'undefined' dl type
            var download = JSON.parse(JSON.stringify(array[i])); //returns new object by value -- not reference
            download.fileType = mime.extension(download.mimeType);
            delete download.downloadType;
            delete download.filePath;

            if (typeof (types[array[i].downloadType]) == "undefined"){
                types[array[i].downloadType] = [];
            }
                types[array[i].downloadType].push(download);
        }
        res.json(types);
    }).catch(function(error){
       console.log(error);
    });
});

router.get('/downloads/:id/', function (req, res) {
    db.downloads.query([req.params.id]).then(function(data){
        var download = data[0][0];

        if (req.query.json){
            delete data[0][0].filePath;
            res.send(data[0]);
        } else {
            var filename = download.name + '.' + mime.extension(download.mimeType);
            console.log(filename);
            res.download('Files/'+download.filePath, filename, function(err){
                if (err){
                    console.log(err);
                } else {
                    console.log('downloaded '+ filename +' with id '+ req.params.id);
                }
            });
        }
    }).catch(function(err){
        if (err.name == 'TypeError'){
            res.status(400).end(err.message);
        } else {
            res.status(500).end(err.message);
        }
    });
});

router.put('/downloads/:id', function (req, res, next) {
    console.log('updating a download');
});

router.delete('downloads/:id', expressJwt({secret: mySecret}), function(req, res){

});

router.post('/downloads', expressJwt({secret: mySecret}),
function (req, res) {
    console.log('creating a download');
});

router.get('/downloadTypes', function(req, res){
    db.downloads.types.query().then(function(data){
        console.log(data[0]);
        res.json(data[0]);
    }).catch(function(err){
        console.log(err);
    });
});

/* POST membership form */
router.post('/members',
    function (req, res) {
        var user = req.body.user;
        db.members.insert(
            [user.first, user.last, user.address,
            user.city, user.state, user.postalCode]
        ).then(function(data){
            return Q.all(user.students.map(function(student){
                return db.members.students.insert([data[0].insertId, student.first, student.last, student.grade, student.unit]);
            })).then(function(val){
                var payment = req.body.payment;
                var date = moment(payment.exp_date, 'MM/YY').toDate();
                return db.members.payments.createCharge(payment,date);
            }).then(function(card){
                var payment = req.body.payment;
                return db.members.payments.insert([data[0].insertId, card.id, payment.first, payment.last, payment.amount])
            }).then(function(){
                res.status(201).location('members/' + data[0].insertId);
                res.send();
            })
        }).catch(function(err){
            if (err.message){
                res.status(400).send(err.message);
                console.log(err);
            }
        });
    }
);

router.get('/members/:id', expressJwt({secret: mySecret}),
    function (req, res) {
        res.json({'accessed':'restricted member ' + req.params.id});
    });

router.post('/admin/login', function(req, res){

    db.admin.verify([req.body.username]).then(function(data){
        if (data[0].length == 0){       //if there is no user with that username
            console.log("bad username");
            res.status(401).send('Incorrect username or password');
        }

        var creds = data[0][0];

        return myCrypt.pbkdf2(req.body.password, creds.salt).then(function(key){
            if (creds.password === key.toString('base64')){            //correct password
                console.log("correct pw");
                return db.admin.getUser([req.body.username])
            } else {
                console.log("bad pw");
                res.status(401).send('Incorrect password or username');
            }
        });
    }).then(function(dbData){
        var user = dbData[0][0];
        var profile = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            type: user.type,
            id: user.adminId
        };

        var token = jwt.sign(profile, mySecret);

        res.json({token:token, user: profile});
    }).catch(function(err){
        console.log('ERROR');
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/admin/me', function(req, res){
    res.send(req.user);
});


router.post('/admin/admin', function(req, res){

    myCrypt.createSalt(512).then(function(data){
        var salt = data.toString('base64');
        return myCrypt.pbkdf2(req.body.password, salt)
            .then(function(key){
                return db.admin.create([
                    req.body.firstName, req.body.lastName, req.body.email,
                    req.body.type,      req.body.username, key.toString('base64'), salt
                ]);

            });
    }).then(function(data){
        console.log(data);
    }).catch(function(err){
        console.log("ERRORED");
        if (err) throw err;
    })
});

router.post('/scholars',
    function (req, res) {
        console.log('post to api/scholars');
    }
);


function combineActivities(jsonpack) {
    return jsonpack.communityActivities.map(function (activity) {
        activity.type = "C";
    }) +
    jsonpack.schoolActivities.map(function (activity) {
        activity.type = "S";
    });
}

module.exports.secret = mySecret;
module.exports.router = router;
