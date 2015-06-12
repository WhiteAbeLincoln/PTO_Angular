var express = require('express');
var router = express.Router();
var Q = require('q');
var json2csv = require('json2csv');
var expressJwt = require('express-jwt');
var mySecret = require('../utility/secret.js');
var Server = require('../utility/server.js');
var db = new Server('members');


/* POST membership form */
router.post('/',
    function (req, res, next) {
        var user = req.body.user;
        db.members.insert(
            [user.first, user.last, user.address,
                user.city, user.state, user.postalCode]
        ).then(function (data) {
                return Q.all(user.students.map(function (student) {
                    return db.members.students.insert([data[0].insertId, student.first, student.last, student.grade, student.unit]);
                })).then(function (val) {
                    var payment = req.body.payment;
                    if (payment.amount !== 0)        //for instances when member chooses not to pay
                        return db.members.payments.createCharge(payment);
                }).then(function (card) {
                    var payment = req.body.payment;
                    if (payment.amount !== 0)
                        return db.members.payments.insert([data[0].insertId, card.id, payment.first, payment.last, payment.amount])
                }).then(function () {
                    res.status(201).location('api/members/' + data[0].insertId);
                    res.send();
                });
            }).catch(function (err) {
                if (err) return next(err);
            });
    }
);

router.get('/:id', expressJwt({secret: mySecret}),
    function (req, res, next) {
        db.members.query([req.params.id]).then(function (data) {
            switch (req.query.mode) {
                case "csv":
                    json2csv({
                            data: data[0],
                            fields: [
                                'id',
                                'lastName',
                                'firstName',
                                'address',
                                'city',
                                'state',
                                'zipCode',
                                'studentIds'
                            ]
                        },
                        function (err, csv) {
                            if (err) return next(err);
                            res.attachment('export.csv').send(csv);
                        }
                    );
                    break;
                default:
                    res.json(data[0]);
            }
        }).catch(function (err) {
            if (err) return next(err);
        });
    });

router.get('/', expressJwt({secret: mySecret}), function (req, res, next) {
    var ids = [];
    var fields = ['id', 'lastName', 'firstName', 'address',
        'city', 'state', 'zipCode', 'studentIds'];
    var func = db.members.queryAll;

    if (req.query["ids"]) {
        ids = req.query["ids"].split(',');
    }

    if (req.query["sub"]) {
        switch (req.query["sub"]) {
            case "students":
                func = db.members.students.queryAll;
                fields = ['id', 'lastName', 'firstName', 'grade', 'unit', 'parentId'];
                break;
            case "payments":
                func = db.members.payments.queryAll;
                fields = ["id", "charge", "nameFirst", "nameLast", "amount", "memberId"];
                break;
            default:
                res.status(404).send("Sub table '" + req.query["sub"] + "' not found");
                return;
                break;
        }
    }

    func().then(function (data) {
        var newFiltered = data[0].filter(function (el) {
            for (var i = 0; i < ids.length; i++) {
                if (el.id == ids[i]) {
                    return true;
                }
            }
            //if ids is an array of length 0, always returns true, resulting in the original array;
            return !ids.length;
        });

        switch (req.query.mode) {
            case "csv":
                json2csv({data: newFiltered, fields: fields}, function (err, csv) {
                    if (err) return next(err);
                    res.attachment('export.csv').send(csv);
                });
                break;
            default:
                res.json(newFiltered);
        }
    }).catch(function (err) {
        if (err) return next(err);
    });
});

module.exports = router;