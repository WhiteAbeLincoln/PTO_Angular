var moment = require('moment');
var mysql = require('mysql');
var Q = require('q');
var stripe = require('stripe')("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

/**
 * New mysql server instance
 * @constructor
 */
function Server() {
    var db = mysql.createConnection({
        host: process.env.PTOMYSQL || 'localhost',
        port: '3306',
        user: 'chudi',
        password: 'm!sQlp4$$w0rd',
        database: 'pto_dev'
    });

    db.connect(function (error) {
        if (error) {
            console.log("Could not connect to the SQL database");
            console.log(error);
            throw error;
        } else {
            console.log("Connected to Database");
        }
    });

    /**
     * A node mysql promise
     * @typedef {promise|*|Q.promise} Mysql
     * @promise {promise|*|Q.promise} Mysql
     * @fulfill {Array<object>} An array of data and server information. Index 0 is returned table data.
     * @reject {Error} If node mysql hits an error with your request
     */

    /**
     * Members object (represents members table in database)
     * @type {{insert: *, query: *, students: {insert: *, query: Function}, payments: {createCharge: Function, insert: *, query: Function}}}
     */
    this.members = {

        /**
         * Inserts into the Members table
         * @param {Array} params [firstName, lastName, address, city, state, zipcode]
         * @returns {Mysql} A promise containing data and server information
         */
        insert: Q.nbind(db.query, db,
            "INSERT INTO Members "
            + "(firstName,lastName,address,city,state,zipCode) "
            + "VALUES "
            + "(?,?,?,?,?,?)"),

        /**
         * Queries the members table
         * @param {Array} params [membershipId]
         * @returns {Mysql} A promise containing data and server information
         */
        query: Q.nbind(db.query, db, "SELECT * FROM Members WHERE membershipId = ?"),
        students: {

            /**
             * Queries the students table
             * @param {Array} params [parentId, firstName, lastName, grade, unit]
             * @returns {Mysql} A promise containing data and server information
             */
            insert: Q.nbind(db.query, db,
                "INSERT INTO M_Students "
                + "(parentId, firstName, lastName, grade, unit) "
                + "VALUES "
                + "(?,?,?,?,?)"),
            query: function () {
            }
        },
        payments: {
            /**
             * Creates a stripe payment charge
             * @param payment {{number: payment.number, exp_date: string, cvv2: number, first: string, last: string, amount: number}} payment object
             * @returns {promise|*|Q.promise} stripe promise
             */
            createCharge: function (payment) {
                var deferred = Q.defer();
                var date = moment(payment.exp_date, 'MM/YY').toDate();
                var obj = {
                    amount: payment.amount * 100,
                    currency: "usd",
                    source: {
                        object: "card",
                        number: payment.number,
                        exp_month: date.getMonth() + 1,
                        exp_year: date.getFullYear(),
                        cvc: payment.cvv2,
                        name: payment.first + ' ' + payment.last
                    },
                    description: 'payment of ' + payment.amount + ' for ' + payment.first + ' ' + payment.last
                };
                stripe.charges.create(obj, function (err, charge) {
                    if (err) {
                        deferred.reject(new Error(err));
                    } else {
                        deferred.resolve(charge);
                    }
                });
                return deferred.promise;
            },

            /**
             * Inserts into the Payments table
             * @param {Array} params [memberId, charge, nameFirst, nameLast, amount]
             * @returns {Mysql} A promise containing data and server information
             */
            insert: Q.nbind(db.query, db,
                "INSERT INTO M_Payments"
                + "(memberId, charge, nameFirst, nameLast, amount) "
                + "VALUES "
                + "(?,?,?,?,?)"),

            query: function () {
            }
        }
    };

    /**
     * Downloads object (represents Downloads table)
     * @type {{queryAll: *, query: *, insert: *, delete: *, types: {queryAll: *, insert: *, query: *}}}
     */
    this.downloads = {

        /**
         * Queries the Downloads and DownloadTypes tables
         * @returns {Mysql} promise resolve: {{id, name, modDate, shortDesc, description, filePath, mimeType, downloadType}}
         */
        queryAll: Q.nbind(db.query, db,
            "SELECT "
            + "Downloads.downloadId AS id, Downloads.downloadName AS name, "
            + "Downloads.modDate, Downloads.shortDesc, Downloads.description, "
            + "Downloads.filePath, Downloads.mimeType, Types.name AS downloadType "
            + "FROM Downloads "
            + "LEFT JOIN DownloadTypes AS Types ON Downloads.downloadType = Types.typeId"),

        /**
         * Queries the Downloads and DownloadTypes tables for single entry
         * @param {Array} params [downloadId]
         * @returns {Mysql} promise resolve: {{id, name, modDate, shortDesc, description, filePath, mimeType, downloadType}}
         */
        query: Q.nbind(db.query, db,
            "SELECT "
            + "Downloads.downloadId AS id, Downloads.downloadName AS name, "
            + "Downloads.modDate, Downloads.shortDesc, Downloads.description, "
            + "Downloads.filePath, Downloads.mimeType, Types.name AS downloadType "
            + "FROM Downloads "
            + "LEFT JOIN DownloadTypes AS Types ON Downloads.downloadType = Types.typeId "
            + "WHERE Downloads.downloadId = ?"),

        /**
         * Inserts into the Downloads table
         * @param {Array} params [downloadType, downloadName, description, shortDesc, filePath, modDate, mimeType]
         * @returns {Mysql} promise
         */
        insert: Q.nbind(db.query, db,
            "INSERT INTO Downloads "
            + "(downloadType, downloadName, description, shortDesc, filePath, modDate, mimeType) "
            + "VALUES "
            + "(?,?,?,?,?,?,?)"),

        /**
         * Deletes an entry from the Downloads table
         * @param {Array} params [downloadId]
         * @returns {Mysql} promise
         */
        delete: Q.nbind(db.query, db,
            "DELETE FROM Downloads WHERE downloadId = ?"),

        /**
         * Types object (represents DownloadTypes table)
         */
        types: {

            /**
             * Queries all columns from DownloadTypes
             * @returns {Mysql} promise
             */
            queryAll: Q.nbind(db.query, db,
                "SELECT * FROM DownloadTypes"),

            /**
             * Inserts into the DownloadTypes table
             * @param {Array} params [name]
             * @returns {Mysql} promise
             */
            insert: Q.nbind(db.query, db,
                "INSERT INTO DownloadTypes "
                + "(name) "
                + "VALUES (?)"),

            /**
             * Queries a single column from DownloadTypes
             * @param {Array} params [name]
             * @returns {Mysql} promise
             */
            query: Q.nbind(db.query, db,
                "SELECT * FROM DownloadTypes WHERE name = ?")
        }
    };

    /**
     *
     * @type {{create: *, verify: *, getUser: *}}
     */
    this.admin = {

        /**
         * Inserts into the Admins table
         * @param {Array} params [firstName, lastName, email, type, username, passwordHash, salt, registrationDate]
         * @returns {Mysql} promise
         */
        create: Q.nbind(db.query, db,
            "INSERT INTO Admins "
            + "(firstName, lastName, email, type, username, password, salt, registrationDate) "
            + "VALUES "
            + "(?,?,?,?,?,?,?,?)"),
        /**
         * Selects all rows from the Admins table where username matches
         * @param {Array} params [username]
         * @returns {Mysql} promise
         */
        query: Q.nbind(db.query, db,
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
        query: function () {
        },

        activities: {
            insert: Q.nbind(db.query, db,
                "INSERT INTO S_Activities "
                + "(applicationId, activityName, hours, nine, ten, eleven, twelve, position, activityType) "
                + "VALUES "
                + "(?,?,?,?,?,?,?,?,?)"),
            query: function () {
            }
        },
        classes: {
            insert: Q.nbind(db.query, db,
                "INSERT INTO S_Classes "
                + "(applicationId, nine, ten, eleven, twelve) "
                + "VALUES "
                + "(?,?,?,?,?)"),
            query: function () {
            }
        },
        employment: {
            insert: Q.nbind(db.query, db,
                "INSERT INTO S_Employment "
                + "(applicationId, jobName, hours, months, nine, ten, eleven, twelve) "
                + "VALUES "
                + "(?,?,?,?,?,?,?,?)"),
            query: function () {
            }
        },
        honors: {
            insert: Q.nbind(db.query, db,
                "INSERT INTO S_Honors "
                + "(applicationId, honorName, nine, ten, eleven, twelve) "
                + "VALUES "
                + "(?,?,?,?,?,?)"),
            query: function () {
            }
        }
    };
}

module.exports = Server;
