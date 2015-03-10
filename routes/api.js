var express = require('express');
var moment = require('moment');
var mysql = require('mysql');
var router = express.Router();
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

var changedRows;

//connecting to the database
var connectToDatabase = mysql.createConnection({
    host: '192.168.0.140',
    port: '3306',
    user: 'chudi',
    password: 'm!sQlp4$$w0rd',
    database: 'pto_dev'
});

//Checks if you are connected to database
connectToDatabase.connect(function (error) {
    if (error) {
        console.log("Could not connect to the SQL database");
        return;
    } else {
        console.log("Connected to Database");
    }
});

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
        console.log('post to api/members');

        insertMembers(req.body, function (id, rows) {
            res.status(201).location('members/' + id);
            res.json({changed: rows});
        });

    }
);

//TODO: fix this
router.get('/members/:id',
    function (req, res) {
        connectToDatabase.query("SELECT firstName, lastName, address, city, state, zipCode, membershipId FROM Members WHERE membershipId=?",
            [req.params.id], function (err, data) {
            var member = data;
            console.log(data);
            connectToDatabase.query("SELECT firstName, lastName, grade, unit "
            + "FROM M_Students "
            + "WHERE parentId=?", [req.params.id], function (err, data) {
                member[0].students = data;
                console.log(member);
            });
        });
    }
);

router.post('/scholars',
    function (req, res) {
        console.log('post to api/scholars');

        insertScholarship(req.body.user);
    }
);


/* Inserts members into the Member table */
function insertMembers(jsonpack, callback) {
    var foreignId = 0;

    var user = jsonpack.user;

    connectToDatabase.query(
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

            console.log("Added member with id " + result.insertId);
            foreignId = result.insertId;

            changedRows += result.affectedRows;

            insertM_Students(jsonpack.user.students, foreignId);
            insertM_Payments(jsonpack.payment, function (err, charge) {

                if (err) {
                    switch (err.type) {
                        case 'StripeCardError':
                            // A declined card error
                            console.log(err.message); // => e.g. "Your card's expiration year is invalid."
                            break;
                        case 'StripeInvalidRequestError':
                            // Invalid parameters were supplied to Stripe's API
                            break;
                        case 'StripeAPIError':
                            // An error occurred internally with Stripe's API
                            break;
                        case 'StripeConnectionError':
                            // Some kind of error occurred during the HTTPS communication
                            break;
                        case 'StripeAuthenticationError':
                            // You probably used an incorrect API key
                            break;
                    }
                } else {
                    connectToDatabase.query(
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
                }

            });

            callback(result.insertId, result.affectedRows);
        }
    );
}


/* Inserts students into the Students table with a foreign key memberId*/
function insertM_Students(students, foreignId) {

    students.forEach(function (student) {

        connectToDatabase.query(
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
                changedRows += result.affectedRows;
            }
        );
    });
}

/* Inserts member Payment info into PaymentInfo table */
function insertM_Payments(payment, callback) {

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
}

function insertScholarship(jsonpack, callback) {
    connectToDatabase.query(
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

            var foreignId = result.insertId;

            console.log("Added scholarship application with id " + result.insertId);

            insertS_Activities(combineActivities(jsonpack), foreignId);
            insertS_Classes(jsonpack.classes, foreignId);
            insertS_Employment(jsonpack.jobs, foreignId);
            insertS_Honors(jsonpack.honors, foreignId);
        }
    );
}

function insertS_Activities(activities, foreignId) {

    activities.forEach(function (activity) {

        connectToDatabase.query(
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
}

function insertS_Classes(classes, foreignId) {
    connectToDatabase.query(
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
}

function insertS_Employment(jobs, foreignId) {
    jobs.forEach(function (job) {
        connectToDatabase.query(
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
}

function insertS_Honors(honors, foreignId) {
    honors.forEach(function (honor) {
        connectToDatabase.query(
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

function combineActivities(jsonpack) {
    var activities;

    jsonpack.communityActivities.forEach(function (activity) {
        activity.type = "C";
        activities.push(activity);
    });

    jsonpack.schoolActivities.forEach(function (activity) {
        activity.type = "S";
        activities.push(activity);
    });

    return activities;
}

module.exports = router;
