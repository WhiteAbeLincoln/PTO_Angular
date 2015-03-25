var moment = require('moment');
var mysql = require('mysql');
var Q = require('q');
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

function Server() {
        var db = mysql.createConnection({
            host: process.env.PTOMYSQL || '192.168.0.12',
            port: '3306',
            user: 'chudi',
            password: 'm!sQlp4$$w0rd',
            database: 'pto_dev'
        });

        db.connect(function (error) {
            if (error) {
                console.log("Could not connect to the SQL database");
                console.log(error);
            } else {
                console.log("Connected to Database");
            }
        });

    this.members = {
        insert: Q.nbind(db.query, db,
            "INSERT INTO Members "
            + "(firstName,lastName,address,city,state,zipCode) "
            + "VALUES "
            + "(?,?,?,?,?,?)"),
        query: Q.nbind(db.query, db, "SELECT * FROM Members WHERE membershipId = ?"),

        students: {
            insert: Q.nbind(db.query, db,
                "INSERT INTO M_Students "
                + "(parentId, firstName, lastName, grade, unit) "
                + "VALUES "
                + "(?,?,?,?,?)"),
            query: function () {}
        },
        payments: {
            createCharge: function(payment, date){
                var deferred = Q.defer();
                var obj = {
                    amount:payment.amount*100,
                    currency:"usd",
                    source: {
                        object:"card",
                        number:payment.number,
                        exp_month: date.getMonth()+1,
                        exp_year: date.getFullYear(),
                        cvc: payment.cvv2,
                        name: payment.first + ' ' + payment.last
                    },
                    description: 'payment of '+payment.amount+' for '+payment.first+' '+payment.last
                };
                stripe.charges.create(obj, function(err, charge){
                    if (err){
                        deferred.reject(new Error(err));
                    } else {
                        deferred.resolve(charge);
                    }
                });
                return deferred.promise;
            },
            insert: Q.nbind(db.query, db,
                "INSERT INTO M_Payments"
                + "(memberId, charge, nameFirst, nameLast, amount) "
                + "VALUES "
                + "(?,?,?,?,?)"),
            query: function () {}
        }
    };

    this.downloads = {
        queryAll:  Q.nbind(db.query, db,
                "SELECT "
                + "Downloads.downloadId AS id, Downloads.downloadName AS name, "
                + "Downloads.modDate, Downloads.shortDesc, Downloads.description, "
                + "Downloads.filePath, Downloads.mimeType, Types.name AS downloadType "
                + "FROM Downloads "
                + "LEFT JOIN DownloadTypes AS Types ON Downloads.downloadType = Types.typeId"),
        query: Q.nbind(db.query, db,
                "SELECT "
                + "Downloads.downloadId AS id, Downloads.downloadName AS name, "
                + "Downloads.modDate, Downloads.shortDesc, Downloads.description, "
                + "Downloads.filePath, Downloads.mimeType, Types.name AS downloadType "
                + "FROM Downloads "
                + "LEFT JOIN DownloadTypes AS Types ON Downloads.downloadType = Types.typeId "
                + "WHERE Downloads.downloadId = ?"),
        insert: Q.nbind(db.query, db,
                "INSERT INTO Downloads "
                + "(downloadType, downloadName, description, shortDesc, filePath, modDate, mimeType) "
                + "VALUES "
                + "(?,?,?,?,?,?,?)"),
        delete: Q.nbind(db.query, db,
                "DELETE FROM Downloads WHERE downloadId = ?"),
        types: {
            queryAll: Q.nbind(db.query, db,
                "SELECT * FROM DownloadTypes"),
            insert: Q.nbind(db.query, db,
                "INSERT INTO DownloadTypes "
                + "(name) "
                + "VALUES (?)"),
            query: Q.nbind(db.query, db,
                "SELECT * FROM DownloadTypes WHERE name = ?")
        }
    };


    this.admin = {
        create: Q.nbind(db.query, db,
                "INSERT INTO Admins "
                + "(firstName, lastName, email, type, username, password, salt) "
                + "VALUES "
                + "(?,?,?,?,?,?,?)"),
        verify: Q.nbind(db.query, db,
                "SELECT username, password, salt "
                + "FROM Admins "
                + "WHERE username = ?"),
        getUser: Q.nbind(db.query, db,
                "SELECT * "
                + "FROM Admins "
                + "WHERE username = ?")
    };

    this.scholarship = {
        insert: Q.nbind(db.query, db,
                "INSERT INTO Scholarships "
                + "(lastName, firstName, middleName, homeAddress, city, zipCode, phoneNumber, emailAddress, essay, gpa) "
                + "VALUES "
                + "(?,?,?,?,?,?,?,?,?,?)"),
        query: function(){},

        activities: {
            insert: Q.nbind(db.query,db,
                    "INSERT INTO S_Activities "
                    + "(applicationId, activityName, hours, nine, ten, eleven, twelve, position, activityType) "
                    + "VALUES "
                    + "(?,?,?,?,?,?,?,?,?)"),
            query: function(){}
        },
        classes: {
            insert: Q.nbind(db.query,db,
                    "INSERT INTO S_Classes "
                    + "(applicationId, nine, ten, eleven, twelve) "
                    + "VALUES "
                    + "(?,?,?,?,?)"),
            query: function(){}
        },
        employment: {
            insert: Q.nbind(db.query,db,
                    "INSERT INTO S_Employment "
                    + "(applicationId, jobName, hours, months, nine, ten, eleven, twelve) "
                    + "VALUES "
                    + "(?,?,?,?,?,?,?,?)"),
            query:function(){}
        },
        honors: {
            insert: Q.nbind(db.query, db,
                    "INSERT INTO S_Honors "
                    + "(applicationId, honorName, nine, ten, eleven, twelve) "
                    + "VALUES "
                    + "(?,?,?,?,?,?)"),
            query:function(){}
        }
    };
}

module.exports = Server;
