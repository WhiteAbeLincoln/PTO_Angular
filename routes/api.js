var express = require('express');
var moment = require('moment');
var mysql = require('mysql');
var router = express.Router();
var memberReq;
var scholarReq;
var changedRows;

//connecting to the database
var connectToDatabase = mysql.createConnection({
	host	 : '192.168.0.140',
	port	 : '3306',
	user	 : 'chudi',
	password : 'm!sQlp4$$w0rd',
	database : 'pto_dev'
});

//Checks if you are connected to database
connectToDatabase.connect(function(error){
	if(error) {
		console.log("Could not connect to the SQL database");
		return;
	} else {
		console.log("Connected to Database");
	}
});

/* GET users listing. */
router.get('/',
    function(req, res) {
        res.status(404).end();
    }
);

router.route('/download/:id')
    .get(function(req,res,next){
        console.log('getting a download');
    })
    .put(function(req,res,next){
        console.log('updating a download');
    });

router.post('/download',
    function(req, res) {
        console.log('creating a download');
    }
);

/* POST membership form */
router.post('/members',
    function(req, res) {
        console.log('post to api/members');

        console.log(req.body);

        insertIntoMembers(req.body, function(id, rows){
            res.status(201).location('members/'+id);
            res.json({changed: rows});
        });
    }
);

//TODO: fix this
router.get('/members/:id',
    function(req, res) {
        connectToDatabase.query("SELECT firstName, lastName, address, city, state, zipCode, membershipId FROM Members WHERE membershipId=?",[req.params.id], function(err, data){
            var member = data;
            console.log(data);
            connectToDatabase.query("SELECT firstName, lastName, grade, unit "
            + "FROM M_Students "
            + "WHERE parentId=?", [req.params.id], function(err, data){
                    member[0].students = data;
                    console.log(member);
            });
        });
    }
);

router.post('/scholars',
    function(req, res) {
	    console.log('post to api/scholars');

	    insertIntoScholarship(req.body.user);
    }
);


/* Inserts members into the Member table */
function insertIntoMembers(jsonpack, callback) {
	var foreignId = 0;

    var user = jsonpack.user;

	connectToDatabase.query(
            "INSERT INTO Members "
        +   "(firstName,lastName,address,city,state,zipCode) "
        +   "VALUES "
        +   "(?,?,?,?,?,?)",
        [
            user.first,     user.last,      user.address,
            user.city,      user.state,     user.postalCode
        ],
        function(err, result) {
            if (err) throw err;

            console.log("Added member with id " + result.insertId);
            foreignId = result.insertId;

            changedRows += result.affectedRows;

            insertIntoStudents(jsonpack.user.students, foreignId);
            insertIntoPaymentInfo(jsonpack.payment, foreignId);
            callback(result.insertId, result.affectedRows);
	    }
    );
}



/* Inserts students into the Students table with a foreign key memberId*/
function insertIntoStudents(students, foreignId) {

	students.forEach(function(student){

		connectToDatabase.query(
                "INSERT INTO M_Students "
            +   "(parentId, firstName, lastName, grade, unit) "
            +   "VALUES "
            +   "(?,?,?,?,?)",
            [
                foreignId,      student.first,  student.last, 
                student.grade,  student.unit
            ],
            function(err, result) {
			    if (err) throw err;

			    console.log("Added student with id " + result.insertId + " and parentId " + foreignId);
		        changedRows += result.affectedRows;
		    }
        );
	});
}

/* Inserts member Payment info into PaymentInfo table */
function insertIntoPaymentInfo(payment, foreignId) {

    if (payment.amount) {
		    connectToDatabase.query(
                    "INSERT INTO M_PaymentInfo "
                +   "(membershipId, firstName, lastName, cardNumber, expDate, securityCode, paymentDate, paymentAmount) "
                +   "VALUES "
                +   "(?,?,?,?,?,?,?,?)",
                [
                    foreignId,          payment.first,  payment.last,                   payment.number, 
                    payment.exp_date,   payment.cvv2,   moment().format('YYYY-MM-DD'),  payment.amount
                ], 
                function(err, result) {
			        if (err) throw err;

			        console.log("Added payment with id " + result.insertId + " and membershipId " + foreignId);
		            changedRows += result.affectedRows;
		        }
            );
    }
}

function insertIntoScholarship(jsonpack){
	connectToDatabase.query(
            "INSERT INTO Scholarships "
        +   "(lastName, firstName, middleName, homeAddress, city, zipCode, phoneNumber, emailAddress, essay, gpa) "
        +   "VALUES "
        +   "(?,?,?,?,?,?,?,?,?,?)",
        [
            jsonpack.last,  jsonpack.first,         jsonpack.middle,    jsonpack.address, 
            jsonpack.city,  jsonpack.postalCode,    jsonpack.phone,     jsonpack.email, 
            jsonpack.essay, jsonpack.gpa
        ],
        function(err, result) {
            if (err) throw err;
            
            var foreignId = result.insertId;

            console.log("Added scholarship application with id " + result.insertId);

            insertIntoS_Activities(combineActivities(jsonpack), foreignId);
            insertIntoS_Classes(jsonpack.classes, foreignId);
            insertIntoS_Employment(jsonpack.jobs, foreignId);
            insertIntoS_Honors(jsonpack.honors, foreignId);
        }
	);
}

function insertIntoS_Activities(activities, foreignId) {

    activities.forEach(function(activity) {

        connectToDatabase.query(
                "INSERT INTO S_Activities "
            +   "(applicationId, activityName, hours, nine, ten, eleven, twelve, position, activityType) "
            +   "VALUES "
            +   "(?,?,?,?,?,?,?,?,?)",
            [
                foreignId,      activity.name,      activity.hours,     activity.cb9,
                activity.cb10,  activity.cb11,      activity.cb12,      activity.om,
                activity.type
            ],
            function(err, result) {
                if (err) throw err;

                console.log("Added Activity entry with id " + result.insertId + " and parentId " + foreignId);
            }
        );
    });
}

function insertIntoS_Classes(classes, foreignId) {
    connectToDatabase.query(
            "INSERT INTO S_Classes "
        +   "(applicationId, nine, ten, eleven, twelve) "
        +   "VALUES "
        +   "(?,?,?,?,?)",
        [
            foreignId,          classes.nine,   classes.ten,
            classes.eleven,     classes.twelve
        ],
        function(err, result) {
            if (err) throw err;

            console.log("Added Classes entry with id " + result.insertId + " and parentId " + foreignId);
        }
    );
}

function insertIntoS_Employment(jobs, foreignId) {
    jobs.forEach(function(job) {
        connectToDatabase.query(
                "INSERT INTO S_Employment "
            +   "(applicationId, jobName, hours, months, nine, ten, eleven, twelve) "
            +   "VALUES "
            +   "(?,?,?,?,?,?,?,?)",
            [
                foreignId,  job.name,   job.hours,  job.months,
                job.cb9,    job.cb10,   job.cb11,   job.cb12
            ],
            function(err, result) {
                if (err) throw err;
                
                console.log("Added Employment Entry with id "+ result.insertId + " and parentId " + foreignId);
            }
        );
    });
}

function insertIntoS_Honors(honors, foreignId) {
    honors.forEach(function(honor) {
        connectToDatabase.query(
                "INSERT INTO S_Honors "
            +   "(applicationId, honorName, nine, ten, eleven, twelve) "
            +   "VALUES "
            +   "(?,?,?,?,?,?)",
            [
                foreignId,      honor.name,   honor.cb9,
                honor.cb10,     honor.cb11,   honor.cb12
            ],
            function(err, result) {
                if (err) throw err;
                
                console.log("Added Employment Entry with id "+ result.insertId + " and parentId " + foreignId);
            }
        );
    });
}

function combineActivities(jsonpack){
    var activities;

    jsonpack.communityActivities.forEach(function(activity){
        activity.type = "C";
        activities.push(activity);
    });

    jsonpack.schoolActivities.forEach(function(activity){
        activity.type = "S";
        activities.push(activity);
    });

    return activities;
}

module.exports = router;
