var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var memberReq;
var scholarReq;
var changedRows = 0;

//connecting to the database
var connectToDatabase = mysql.createConnection({
	host	 : 'localhost',
	port	 : '3306',
	user	 : 'root',
	password : 'F22raptoraf!',
	database : 'pto_dev'
});

//Checks if you are connected to database
connectToDatabase.connect(function(error){
	if(error){
		console.log("Could not connect to the SQL database");
		return;
		
	}else{
		console.log("Connected to Database");
		
	}
});

/* GET users listing. */
router.get('/', function(req, res){
    res.json({message: 'hooray! welcome to the api!'});
});

/* POST membership form */
router.post('/membership', function(req, res) {
    console.log('post to api/members');
    console.log(req.body);

	memberReq = (req.body);

	var memberId = insertIntoMembers(memberReq);
	insertIntoStudents(memberReq.user.students, memberId);
	
	res.json({rowsChanged: changedRows});
});

function insertIntoMembers(jsonpack) {
	var memberId = 0;

	connectToDatabase.query("INSERT INTO Members(firstName,lastName,address,city,state,zip) VALUES (?,?,?,?,?,?)",
	[jsonpack.user.first,jsonpack.user.last,jsonpack.user.address,jsonpack.user.city,jsonpack.user.state,jsonpack.user.postalCode],
    function(err, result){
		    if (err) throw err;
		
		    console.log("Added member with id " + result.insertId);
		    memberId = result.insertId;
		
		    changedRows += result.affectedRows;
	    });
	
	console.log("Wrote to Members");
	return memberId;
}

function insertIntoStudent(students, memberId) {
	var parentId = memberId;
	students.forEach(function(student){

		connectToDatabase.query("INSERT INTO Students(parentId, firstName, lastName, grade, unit) VALUES (?,?,?,?,?)",
        [parentId, student.firstName, student.lastName, student.grade, students.unit], function(err, result){
			if (err) throw err;
			
			console.log("Added student with id " + result.insertId + " and parentId " + parentId);
		
		});
		
	});
    console.log("Wrote to Students");
}

module.exports = router;
