var moment = require('moment');
var mysql = require('mysql');
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

var server = function(){
        this.members = function() {
            this.insert = function(jsonpack, callback){
                var user = jsonpack.user;
                connectToDatabase.query(
                    "INSERT INTO Members "
                    + "(firstName,lastName,address,city,state,zipCode) "
                    + "VALUES "
                    + "(?,?,?,?,?,?)",
                    [
                        user.first, user.last, user.address,
                        user.city, user.state, user.postalCode
                    ], function(err, result){
                        if (err) throw err;
                        callback(result);
                    });
            };
            this.query = function(){

            };
            this.students = function() {
                this.insert = function(students, foreignId, callback){
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
                                callback(result);
                            }
                        );
                    });
                };
                this.query = function(){

                };
            };

            this.payments = function() {
                this.insert = function(payment, callback){
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
                };
                this.query = function(){

                };
            }
        }

};

