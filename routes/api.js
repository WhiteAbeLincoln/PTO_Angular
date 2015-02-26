var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var memberReq;
var scholarReq;
var changedRows;

//connecting to the database
var connectToDatabase = mysql.createConnection({
	host	 : 'localhost',
	port	 : '3306',
	user	 : 'chudi',
	password : 'm!sQlp4$$w0rd',
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
router.post('/members', function(req, res) {
    console.log('post to api/members');

	memberReq = (req.body);

	insertIntoMembers(memberReq);
	
	res.json({rowsChanged: changedRows});
	
});
/*Post to Scholarship */
router.post('/scholars', function(req, res) {
    console.log('post to api/scholars');
    
    scholarReq = req.body;
    
    var ScholarId = insertIntoScholars(scholarReq.user);
    
});

function insertIntoScholars(jsonpack){
       var scholarId = 0;
       
    
    
    jsonpack.user.phone = jsonpack.user.phone.replace(/+() -]/g, "");

    connectToDatabase.query("INSERT INTO Scholarships(lastName, firstName, middleName, homeAddress, city, zipCode, phoneNumber, emailAddress, essay, gpa) VALUES (?,?,?,?,?,?,?,?,?,?)", [jsonpack.user.last, jsonpack.first, jsonpack.middle, jsonpack.address, jsonpack.city, jsonpack.postalCode, jsonpack.phone, jsonpack.emailAddress,   jsonpack.essay, jsonpack.gpa], 
    
    function(err, result){
    if(err) throw err;
        scholarId = result.insertId;
        
        console.log("Added scholar with id " + result.insertId)
        
        insertIntoSClasses(jsonpack, scholarId);
        insertIntoSActivites(jsonpack.schoolActivities, scholarId);
        insertIntoSEmployment(jsonpack, ScolarshipId);
        insertIntoSHonors(jsonpack, scholarshipId);
        
    });
}
/*Inserting into S_Classes*/
function insertIntoSClasses(jsonpack, scholarId){
    connectToDatabase.query("INSERT INTO S_Classes(applicationId, nine, ten, eleven, twelve) VALUES (?,?,?,?,?)", [scholarId, jsonpack.nine, jsonpack.ten, jsonpack.eleven, jsonpack.twelve], 
        function(err, result){
           if(err) throw err;
           
           console.log("Added class with id " + result.insertId + " and scholarId " + scholarId);    
    });
}
/*Insert into S_Activities*/
function insertIntoSActivities(jsonpack, scholarId){
    jsonpack.forEach(function(jsonpack){
        connectToDatabase.query("INSERT INTO S_Activites(activityName, hours, nine, ten, eleven, twelve, type) VALUES (?, ?, ?, ?, ?, ?)",
         [jsonpack.name, jsonpack.hours, jsonpack.cb9, jsonpack.cb10, jsonpack.cb11, jsonpack.cb12, jsonpack.om], function(err, result){
            if(err) throw err;   
            
            console.log("Added activites with id:" + result.insertId + "and activityId:" + activityId);
         } );   
        
}








/* Inserts members into the Member table */
function insertIntoMembers(jsonpack) {
	var memberId = 0;

	connectToDatabase.query("INSERT INTO Members(firstName,lastName,address,city,state,zipCode) VALUES (?,?,?,?,?,?)",
	[jsonpack.user.first,jsonpack.user.last,jsonpack.user.address,jsonpack.user.city,jsonpack.user.state,jsonpack.user.postalCode]
    function(err, result){
		    if (err) throw err;
		    
		    console.log("Added member with id " + result.insertId);
		    memberId = result.insertId;
		
		    changedRows += result.affectedRows;
            
            insertIntoStudents(jsonpack.user.students, memberId);
            insertIntoPaymentInfo(jsonpack.payment, memberId);
	    });
}
    
    
    
/* Inserts students into the Students table with a foreign key memberId*/
function insertIntoStudents(students, memberId) {

	students.forEach(function(student){

		connectToDatabase.query("INSERT INTO M_Students(parentId, firstName, lastName, grade, unit) VALUES (?,?,?,?,?)",
        [memberId, student.first, student.last, student.grade, student.unit], function(err, result){
			if (err) throw err;
			
			console.log("Added student with id " + result.insertId + " and parentId " + memberId);
		    changedRows += result.affectedRows;
		});
	});
}

/* Inserts member Payment info into PaymentInfo table */
function insertIntoPaymentInfo(payment, memberId) {


if (payment.first !== null && payment.last !== null && payment.number !== null) {
		connectToDatabase.query("INSERT INTO M_PaymentInfo(membershipId, firstName, lastName, cardNumber, expDate, securityCode, paymentDate, paymentAmount) VALUES (?,?,?,?,?,?,?,?)",
        [memberId, payment.first, payment.last, payment.number, payment.exp_date, payment.cvv2, Date.now(), payment.amount], function(err, result){
			if (err) throw err;
			
			console.log("Added payment with id " + result.insertId + " and membershipId " + memberId);
		    changedRows += result.affectedRows;
		});
}
}

module.exports = router;
