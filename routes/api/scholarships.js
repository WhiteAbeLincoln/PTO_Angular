var express = require('express');
var router = express.Router();
var Q = require('q');
var json2csv = require('json2csv');
var expressJwt = require('express-jwt');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var Server = require('../utility/server.js');
var db = new Server('scholarships');

/* POST scholarship form */
router.post('/',
    function (req, res) {
        var user = req.body.user;
        db.scholarship.insert(
            [
                user.first, user.last,  user.middle,    user.address,
                user.city,  user.state, user.postalCode,
                user.phone, user.email, user.essay,     user.gpa
            ]
        ).then(function(data){
                var activities = [];
                user.schoolActivities.forEach(function(activity){
                    activity.type="school";
                    activities.push(activity);
                });
                user.communityActivities.forEach(function(activity){
                    activity.type="community";
                    activities.push(activity);
                });

                return Q.all(activities.map(function(activity){
                        return db.scholarship.activities.insert(
                            [
                                data[0].insertId,   activity.name, activity.hours,
                                activity.cb9,       activity.cb10, activity.cb11,   activity.cb12,
                                activity.position,  activity.type
                            ]);
                    })
                ).then(
                    Q.all(user.honors.map(function(honor){
                        return db.scholarship.honors.insert(
                            [
                                data[0].insertId, honor.name,
                                honor.cb9, honor.cb10, honor.cb11, honor.cb12
                            ]);
                    }))
                ).then(
                    Q.all(user.jobs.map(function(job){
                        return db.scholarship.employment.insert(
                            [
                                data[0].insertId,   job.name,   job.hours,  job.months,
                                job.cb9,            job.cb10,   job.cb11,   job.cb12
                            ]);
                    }))
                ).then(
                    db.scholarship.classes.insert(
                        [
                            data[0].insertId,
                            user.classes.nine, user.classes.ten, user.classes.eleven, user.classes.twelve
                        ])
                ).then(function(){
                        res.status(201).location('api/scholarships/' + data[0].insertId);
                        res.send();
                    });

            })
            .catch(function(err){
                if (err.message){
                    res.status(400).send(err.message);
                    console.log(err.stack);
                }
            });
    }
);

router.get('/', function (req, res) {
    var ids = [];
    var fields = ['id','lastName','firstName', 'middleName', 'address', 'city','state','zipCode',
        'phoneNumber', 'email', 'gpa', 'activityIds', 'classIds', 'employmentIds', 'honorsIds'];
    var func = db.scholarship.queryAll;

    if (req.query["ids"]){
        ids = req.query["ids"].split(',');
    }

    if (req.query["sub"]) {
        switch(req.query["sub"]) {
            case "classes":
                func = db.scholarship.classes.queryAll;
                fields = ['id','lastName','firstName','grade','unit','parentId'];
                break;
            case "employment":
                func = db.scholarship.employment.queryAll;
                fields = ["id", "charge", "nameFirst", "nameLast", "amount", "memberId"];
                break;
            case "honors":
                func = db.scholarship.honors.queryAll;
                fields = ["id", "charge", "nameFirst", "nameLast", "amount", "memberId"];
                break;
            case "activities":
                func = db.scholarship.activities.queryAll;
                fields = ["id", "charge", "nameFirst", "nameLast", "amount", "memberId"];
                break;

            default:
                res.status(404).send("Sub table '"+ req.query["sub"] +"' not found");
                return;
                break;
        }
    }

    func().then(function(data) {
        var newFiltered = data[0].filter(function (el) {
            for (var i = 0; i < ids.length; i++) {
                if (el.id == ids[i]) {
                    return true;
                }
            }
            //if ids is an array of length 0, always returns true, resulting in the original array;
            return !ids.length;
        });

        if (req.query.mode == "csv") {
            json2csv({ data: newFiltered, fields: fields }, function(err, csv) {
                if (err) console.log(err);
                res.attachment('export.csv').send(csv);
            });
        } else {
            res.json(newFiltered);
        }
    }).catch(function(err){
        console.log(err);
    });

});

module.exports = router;
