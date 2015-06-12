var express = require('express');
var router = express.Router();
var Q = require('q');
var json2csv = require('json2csv');
var officegen = require('officegen');
var moment = require('moment');
var fs = require('fs');
var expressJwt = require('express-jwt');
var mySecret = require('../utility/secret.js');
var Server = require('../utility/server.js');
var db = new Server('scholarships');

/* POST scholarship form */
router.post('/',
    function (req, res) {
        var user = req.body.user;
        var now = moment().format("YYYY-MM-DD");
        db.scholarship.insert(
            [
                user.first, user.last,  user.middle,    user.address,
                user.city,  user.state, user.postalCode,
                user.phone, user.email, user.essay,     user.gpa, now
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

router.get('/', expressJwt({secret: mySecret}), function (req, res) {
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

router.get('/:id', expressJwt({secret: mySecret}), function (req, res) {
    db.scholarship.query([req.params.id]).then(
        function(data) {
            switch (req.query.mode) {
                case "csv":
                    console.log('scholarship csv');
                    break;
                case "docx":
                    exportAsWord(data[0], req.params.id, function(docx, name) {
                        var headerString = 'attachment; filename="' + name + '.docx"';
                        res.set("Content-Disposition", headerString);
                        res.type('docx');
                        docx.generate(res);
                    });
                    break;
                default:
                    res.json(data[0]);
            }
        }
    )

});

function exportAsWord(app, id, callback) {
    getActivities(id, function(err, activities) {
        if (err) console.log('ERROR: ', err);

        var docx = officegen('docx');
        var application = app[0];

        var paragraphs = application.essay.split('\n');

        var name = application.lastName + ', '
            + application.firstName + ' '
            + application.middleName;

        docx.createP({align: 'center'})
            .addText(name, {font_size: 22});

        docx.createP()
            .addText(
            "Address: "
            + application.address + " "
            + application.city + ", "
            + application.state + " "
            + application.zipCode
        );

        docx.createP().addText("Phone: " + application.phoneNumber);
        docx.createP().addText("Email: " + application.email);
        docx.putPageBreak();

        // ACADEMIC INFORMATION
        docx.createP({align: 'center'}).addText("Academic Information", {font_size: 16});
        docx.createP().addText("GPA: " + application.gpa);
        docx.createP().addText("Honors Classes", {bold: true, font_size: 14});

        if (activities.classes.length) {
            docx.createP().addText("9th: " + activities.classes[0].nine);
            docx.createP().addText("10th: " + activities.classes[0].ten);
            docx.createP().addText("11th: " + activities.classes[0].eleven);
            docx.createP().addText("12th: " + activities.classes[0].twelve);
        }
        docx.putPageBreak();

        // ACTIVITIES
        docx.createP({align: 'center'}).addText("Activities Information", {font_size: 16});
        var schoolActivities = activities.activities.filter(function(activity) {
            return activity.activityType == "school";
        });
        var communityActivities = activities.activities.filter(function(activity) {
            return activity.activityType == "community";
        });

        // School
        docx.createP().addText("School-Related Activities", {bold: true, font_size: 14});
        addActivityTable(schoolActivities);

        // Community
        docx.createP().addText("Community Activities", {bold: true, font_size: 14});
        addActivityTable(communityActivities);

        // Honors
        docx.createP().addText("Honors/Awards", {bold: true, font_size: 14});
        var honors = activities.honors;
        for (var i = 0; i < honors.length; i++) {
            var p = docx.createP();
            p.addText("Honor/Award: ", {bold: true});
            p.addText(honors[i].honorName);
            p.addLineBreak();


            p.addText("Year of Honor or Award: ", {bold: true});
            p.addText(
                (honors[i].nine ? "9, " : "")
                +   (honors[i].ten ? "10, " : "")
                +   (honors[i].eleven ? "11, " : "")
                +   (honors[i].twelve ? "12, " : "")
            );
        }

        // Paid Employment
        docx.createP().addText("Paid Employment", {bold: true, font_size: 14});
        var jobs = activities.employment;
        for (var i = 0; i < jobs.length; i++) {
            var p = docx.createP();
            p.addText("Place of Employment: ", {bold: true});
            p.addText(jobs[i].jobName);
            p.addLineBreak();

            p.addText("Hours per month: ", {bold: true});
            p.addText(jobs[i].hours.toString());
            p.addLineBreak();

            p.addText("Months per year: ", {bold: true});
            p.addText(jobs[i].months.toString());
            p.addLineBreak();

            p.addText("Years of Employment: ", {bold: true});
            p.addText(
                (jobs[i].nine ? "9, " : "")
                +   (jobs[i].ten ? "10, " : "")
                +   (jobs[i].eleven ? "11, " : "")
                +   (jobs[i].twelve ? "12, " : "")
            );
        }

        docx.putPageBreak();

        docx.createP({align: 'center'}).addText("Essay", {font_size: 16});

        for (var i = 0; i < paragraphs.length; i++) {
            var pObj = docx.createP();
            pObj.addText(paragraphs[i].toString());
        }

        var filename = application.lastName + "_" + application.firstName + "_" + application.middleName;
        callback(docx, filename);

        function addActivityTable(actArr) {
            for (var i = 0; i < actArr.length; i++) {
                var p = docx.createP();
                p.addText("Activity: ", {bold: true});
                p.addText(actArr[i].activityName.toString());
                p.addLineBreak();

                p.addText("Position: ", {bold: true});
                p.addText(actArr[i].position.toString());
                p.addLineBreak();

                p.addText("Hours per month: ", {bold: true});
                p.addText(actArr[i].hours.toString());
                p.addLineBreak();

                p.addText("Years of Involvement: ", {bold: true});
                p.addText(
                    (actArr[i].nine ? "9, " : "")
                    +   (actArr[i].ten ? "10, " : "")
                    +   (actArr[i].eleven ? "11, " : "")
                    +   (actArr[i].twelve ? "12, " : "")
                );
            }
        }
    });
}

function getActivities(scholarshipId, callback) {
    var activities = {};
    var error = null;

    db.scholarship.activities.query([scholarshipId]).then(function(data) {

        activities.activities = data[0];
        return db.scholarship.classes.query([scholarshipId]);
    }).then(function(data) {

        activities.classes = data[0];
        return db.scholarship.employment.query([scholarshipId]);

    }).then(function(data) {

        activities.employment = data[0];
        return db.scholarship.honors.query([scholarshipId]);

    }).then(function(data) {

        activities.honors = data[0];

    }).catch(function(err) {

        if (err) error = err;

    }).finally(function() {
        return callback(error, activities);
    })
}

module.exports = router;
