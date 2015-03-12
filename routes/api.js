var express = require('express');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var Q = require('q');
var router = express.Router();
var Server = require('./server.js');


var db = new Server();

/* GET users listing. */
router.get('/',
    function (req, res) {
        res.status(404).end();
    }
);

router.route('/download/:id')
    .get(function (req, res, next) {
        console.log('getting a download');
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
        console.log(req.body);
        db.members.insert(
            [user.first, user.last, user.address,
            user.city, user.state, user.postalCode]
        ).then(function(data){
                console.log('students');
            return Q.all(user.students.map(function(student){
                return db.members.students.insert([data[0].insertId, student.first, student.last, student.grade, student.unit]);
            })).then(function(val){
                console.log('payments');
                var payment = req.body.payment;
                var date = moment(payment.exp_date, 'MM/YY').toDate();
                return db.members.payments.createCharge(payment,date);
            }).then(function(card){
                console.log('payments database');
                var payment = req.body.payment;
                return db.members.payments.insert([data[0].insertId, card.id, payment.first, payment.last, payment.amount])
            }).then(function(){
                res.status(201).location('members/' + data[0].insertId);
                res.send();
            })
        }).catch(function(err){
            console.log('ERRORED correctly');
            if (err.message){
                res.status(400).send(err.message);
                console.log(err);
            }
        });
    }
);

//TODO: fix this
router.get('/members/:id',
    function (req, res) {
        db.members.query(req.params.id).then(function(data){
            res.json(data[0][0]);
        }).catch(function(err){
            if (err) throw err;
        });
    }
);

router.post('/admin/login', function(req, res){
    //TODO: Change to db query
    console.log(req.body);

    if (!(req.body.username === 'abe' && req.body.password === 'pass')){
        res.status(401).send('Incorrect username or password');
    }

    var profile = {
        firstName: 'Abe',
        lastName: 'White',
        email: 'abelincoln.white@gmail.com',
        id:1
    };

    var token = jwt.sign(profile, 'secrets');

    res.json({token:token, user: profile});
});

router.get('/admin/me', function(req, res){
    res.send(req.user);
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
