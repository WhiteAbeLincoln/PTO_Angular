var express = require('express');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var Q = require('q');
var myCrypt = require('./utility/crypto.js');
var router = express.Router();
var Server = require('./utility/server.js');


var db = new Server();

/* GET users listing. */
router.get('/',
    function (req, res) {
        res.status(404).end();
    }
);

router.route('/download/:id')
    .get(function (req, res, next) {
        res.download('C:/Users/31160/Documents/angular.js', 'angular'+req.params.id+'.js', function(err){
            if (err){
                console.log(err);
            } else {
                console.log('downloaded file with id '+ req.params.id);
            }
        })
    })
    .put(function (req, res, next) {
        console.log('updating a download');
    });

router.post('/download',
    function (req, res) {
        console.log('creating a download');
    }
);

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

        var token = jwt.sign(profile, 'secrets');

        res.json({token:token, user: profile});
    }).catch(function(err){
        console.log('ERROR');
        console.log(err);
        res.status(500).send(err);
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

router.get('/admin/members/:id',
function (req, res) {
    res.json({'accessed':'restricted member ' + req.params.id});
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

module.exports = router;
