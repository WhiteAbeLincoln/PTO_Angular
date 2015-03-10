var moment = require('moment');
var mysql = require('mysql');
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

function Server() {
    var db = (function init() {
        var mdb = mysql.createConnection({
            host: '192.168.0.140',
            port: '3306',
            user: 'chudi',
            password: 'm!sQlp4$$w0rd',
            database: 'pto_dev'
        });

        mdb.connect(function (error) {
            if (error) {
                console.log("Could not connect to the SQL database");
            } else {
                console.log("Connected to Database");
            }
        });

        return mdb;
    })();

    this.members = {
        insert: function (jsonpack, callback) {
            var user = jsonpack.user;
            db.query(
                "INSERT INTO Members "
                + "(firstName,lastName,address,city,state,zipCode) "
                + "VALUES "
                + "(?,?,?,?,?,?)",
                [
                    user.first, user.last, user.address,
                    user.city, user.state, user.postalCode
                ],
                function (err, result) {
                    if (err) throw err;
                    callback(result);
                });
        },
        query: function () {
            console.log('members query');
        },

        students: {
            insert: function (students, foreignId) {
                students.forEach(function (student) {
                    db.query(
                        "INSERT INTO M_Students "
                        + "(parentId, firstName, lastName, grade, unit) "
                        + "VALUES "
                        + "(?,?,?,?,?)",
                        [
                            foreignId, student.first, student.last,
                            student.grade, student.unit
                        ],
                        function (err, result) {
                            if (err) throw err;

                            console.log("Added student with id " + result.insertId + " and parentId " + foreignId);
                        }
                    );
                });
            },
            query: function () {
                console.log('members students query');
            }
        },
        payments: {
            make: function (payment, callback) {
                if (payment.amount) {

                    stripe.charges.create({
                        amount: payment.amount,
                        currency: "usd",
                        source: {
                            number: payment.number,
                            exp_month: payment.exp_date.split('/')[0],
                            exp_year: moment(payment.exp_date, 'MM/YY').toDate().getFullYear(),
                            cvc: payment.cvv2
                        },
                        description: 'charge for ' + payment.first + ' ' + payment.last
                    }, function (err, charge) {
                        callback(err, charge);
                    });
                }
            },
            insert: function(jsonpack, charge, foreignId){
                db.query(
                    "INSERT INTO M_Payments"
                    +   "(memberId, charge, nameFirst, nameLast) "
                    +   "VALUES "
                    +   "(?,?,?,?)",
                    [foreignId, charge.id, jsonpack.payment.first, jsonpack.payment.last],
                    function(err, result){
                        if (err) throw err;

                        console.log('saved record of stripe payment with id of ' + result.insertId);
                    }
                );
            },
            query: function () {
                console.log('members payments query');
            }
        }
    };

    this.scholarship = {
        insert: function(jsonpack, callback){
            db.query(
                "INSERT INTO Scholarships "
                + "(lastName, firstName, middleName, homeAddress, city, zipCode, phoneNumber, emailAddress, essay, gpa) "
                + "VALUES "
                + "(?,?,?,?,?,?,?,?,?,?)",
                [
                    jsonpack.last, jsonpack.first, jsonpack.middle, jsonpack.address,
                    jsonpack.city, jsonpack.postalCode, jsonpack.phone, jsonpack.email,
                    jsonpack.essay, jsonpack.gpa
                ],
                function (err, result) {
                    if (err) throw err;
                    callback(result);
                });
        },
        query: function(){},

        activities: {
            insert: function(activities, foreignId){
                activities.forEach(function (activity) {
                    db.query(
                        "INSERT INTO S_Activities "
                        + "(applicationId, activityName, hours, nine, ten, eleven, twelve, position, activityType) "
                        + "VALUES "
                        + "(?,?,?,?,?,?,?,?,?)",
                        [
                            foreignId, activity.name, activity.hours, activity.cb9,
                            activity.cb10, activity.cb11, activity.cb12, activity.om,
                            activity.type
                        ],
                        function (err, result) {
                            if (err) throw err;

                            console.log("Added Activity entry with id " + result.insertId + " and parentId " + foreignId);
                        }
                    );
                });
            },
            query: function(){

            }
        },
        classes: {
            insert: function(classes, foreignId) {
                db.query(
                    "INSERT INTO S_Classes "
                    + "(applicationId, nine, ten, eleven, twelve) "
                    + "VALUES "
                    + "(?,?,?,?,?)",
                    [
                        foreignId, classes.nine, classes.ten,
                        classes.eleven, classes.twelve
                    ],
                    function (err, result) {
                        if (err) throw err;

                        console.log("Added Classes entry with id " + result.insertId + " and parentId " + foreignId);
                    }
                );
            },
            query: function(){

            }
        },
        employment: {
            insert: function(jobs, foreignId) {
                jobs.forEach(function (job) {
                    db.query(
                        "INSERT INTO S_Employment "
                        + "(applicationId, jobName, hours, months, nine, ten, eleven, twelve) "
                        + "VALUES "
                        + "(?,?,?,?,?,?,?,?)",
                        [
                            foreignId, job.name, job.hours, job.months,
                            job.cb9, job.cb10, job.cb11, job.cb12
                        ],
                        function (err, result) {
                            if (err) throw err;

                            console.log("Added Employment Entry with id " + result.insertId + " and parentId " + foreignId);
                        }
                    );
                });
            },
            query:function(){

            }
        },
        honors: {
            insert: function(honors, foreignId) {
                honors.forEach(function (honor) {
                    db.query(
                        "INSERT INTO S_Honors "
                        + "(applicationId, honorName, nine, ten, eleven, twelve) "
                        + "VALUES "
                        + "(?,?,?,?,?,?)",
                        [
                            foreignId, honor.name, honor.cb9,
                            honor.cb10, honor.cb11, honor.cb12
                        ],
                        function (err, result) {
                            if (err) throw err;

                            console.log("Added Employment Entry with id " + result.insertId + " and parentId " + foreignId);
                        }
                    );
                });
            }
        }
    };
}

module.exports = Server;