var express = require('express');
var moment = require('moment');
var mysql = require('mysql');
var router = express.Router();
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

var changedRows;

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

                }

            });
}


/* Inserts students into the Students table with a foreign key memberId*/
function insertM_Students(students, foreignId) {


}

/* Inserts member Payment info into PaymentInfo table */
function insertM_Payments(payment, callback) {

}

function insertScholarship(jsonpack, callback) {
            var foreignId = result.insertId;

            console.log("Added scholarship application with id " + result.insertId);

            insertS_Activities(combineActivities(jsonpack), foreignId);
            insertS_Classes(jsonpack.classes, foreignId);
            insertS_Employment(jsonpack.jobs, foreignId);
            insertS_Honors(jsonpack.honors, foreignId);

}

function insertS_Activities(activities, foreignId) {


}

function insertS_Classes(classes, foreignId) {

}

function insertS_Employment(jobs, foreignId) {

}

function insertS_Honors(honors, foreignId) {

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
