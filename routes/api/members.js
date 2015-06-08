var express = require('express');
var router = express.Router();
var Q = require('q');
var json2csv = require('json2csv');
var expressJwt = require('express-jwt');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var Server = require('../utility/server.js');
var db = new Server('members');


/* POST membership form */
router.post('/',
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
                    if (payment.amount !== 0)        //for instances when member chooses not to pay
                        return db.members.payments.createCharge(payment);
                }).then(function(card){
                    var payment = req.body.payment;
                    if (payment.amount !== 0)
                        return db.members.payments.insert([data[0].insertId, card.id, payment.first, payment.last, payment.amount])
                }).then(function(){
                    res.status(201).location('api/members/' + data[0].insertId);
                    res.send();
                });
            }).catch(function(err){
                if (err.message){
                    res.status(400).send(err.message);
                    console.log(err.stack);
                }
            });
    }
);

router.get('/:id', expressJwt({secret: mySecret}),
    function (req, res) {
        db.members.query([req.params.id]).then(function(data){
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
                        ]},
                        function(err, csv) {
                            if (err) console.log(err);
                            res.attachment('export.csv').send(csv);
                        }
                    );
                    break;
                default:
                    res.json(data[0]);
            }
        }).catch(function(err){
            console.log(err);
        });
    });

router.get('/', expressJwt({secret: mySecret}), function(req, res) {
    var ids = [];
    var fields = ['id','lastName','firstName','address',
                    'city','state','zipCode','studentIds'];
    var func = db.members.queryAll;

    if (req.query["ids"]){
        ids = req.query["ids"].split(',');
    }

    if (req.query["sub"]) {
        switch(req.query["sub"]) {
            case "students":
                func = db.members.students.queryAll;
                fields = ['id','lastName','firstName','grade','unit','parentId'];
                break;
            case "payments":
                func = db.members.payments.queryAll;
                fields = ["id", "charge", "nameFirst", "nameLast", "amount", "memberId"];
                break;
            default:
                res.status(404).send("Sub table '"+ req.query["sub"] +"' not found");
                return;
                break;
        }
    }

    func().then(function(data){
        var newFiltered = data[0].filter(function(el){
            for (var i=0; i < ids.length; i++) {
                if (el.id == ids[i]){
                    return true;
                }
            }
            //if ids is an array of length 0, always returns true, resulting in the original array;
            return !ids.length;
        });

        switch (req.query.mode) {
            case "csv":
                json2csv({ data: newFiltered, fields: fields }, function(err, csv) {
                    if (err) console.log(err);
                    res.attachment('export.csv').send(csv);
                });
                break;
            default:
                res.json(newFiltered);
        }
    }).catch(function(err){
        console.log(err);
    });
});

module.exports = router;