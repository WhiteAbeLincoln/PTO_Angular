var moment = require('moment');
var express = require('express');
var fs = require('fs');
var mime = require('mime');
var zip = require('jszip');
var expressJwt = require('express-jwt');
var sanitize = require('sanitize-filename');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var router = express.Router();
var Server = require('../utility/server.js');
var db = new Server('downloads');

    router.get('/', function (req, res) {
        db.downloads.queryAll().then(function(data){
            var types = {};
            var array = data[0];

            //creates an array of downloadTypes containing downloads from my returned array of download objects
            for (var i in array) {
                var download = JSON.parse(JSON.stringify(array[i])); //returns new object by value -- not reference
                download.fileType = mime.extension(download.mimeType);
                //these are not needed by client, so deleted for security
                delete download.downloadType;
                delete download.filePath;

                //bonus -- any downloads w/o a type will be added to an 'undefined' dl type
                if (typeof (types[array[i].downloadType]) == "undefined"){
                    types[array[i].downloadType] = [];
                }
                types[array[i].downloadType].push(download);
            }
            res.json(types);
        }).catch(function(error){
            console.error(error);
        });
    });

    router.get('/:id', function (req, res) {
        db.downloads.query([req.params.id]).then(function(data){
            var download = data[0][0];

            if (req.query.mode == "json"){
                delete data[0][0].filePath;
                res.send(data[0]);
            } else if (req.query.mode == "view") {
                var options = {
                    root: __dirname + '/../../',
                    dotfiles: 'deny'
                };
                res.sendFile(download.filePath, options, function(err) {
                    if (err) {
                        console.error(err);
                        res.status(err.status).end();
                    } else  {
                        console.log("Sent: ", download.filePath);
                    }
                });
            } else {
                var filename = download.name + '.' + mime.extension(download.mimeType);
                res.download(download.filePath, sanitize(filename), function(err){
                    if (err){
                        console.error(err);
                        res.status(err.status).end();
                    } else {
                        console.log('downloaded '+ filename +' with id '+ req.params.id);
                    }
                });
            }
        }).catch(function(err){
            if (err.name == 'TypeError'){
                res.status(400).end(err.message);
            } else {
                res.status(500).end(err.message);
            }
        });
    });

    router.delete('/:id', expressJwt({secret: mySecret}), function (req, res) {
        db.downloads.query([req.params.id]).then(function(data){
            var download = data[0][0];

            fs.unlink(download.filePath, function(err){                                             //deletes the file from the filesystem
                if (err) console.error(err);
            });


            return db.downloads.delete([req.params.id]);                                            //deletes the database entry
        }).then(function(data){
            res.status(204).send();
        }).catch(function(err){
            console.error(err);
        });
    });

    router.post('/', expressJwt({secret: mySecret}),
        function (req, res) {
            var path = 'files/downloads/';
            var body = req.body;
            var filename = body.name + Math.floor(new Date() / 1000);                               //appends unix timestamp to the name -- ensures unique filename
            var now = moment().format("YYYY-MM-DD HH:mm:ss");


            var files = body.files.map(function (file) {
                var fileArr = file.data.split(',');
                file.data = fileArr[1];

                if (typeof(file.type) == 'undefined') {
                    file.mime =
                        fileArr[0].slice("data:".length, fileArr[0].length - ";base64".length)      //grabs the mimetype info from inside the string "data:MIMEGOESHERE;base64"
                        || "application/octet-stream";                                              //or if there is no type, sets it to binary
                } else {
                    file.mime = file.type || "application/octet-stream";
                }
                return file;
            });

            if (typeof(body.shortDesc) == 'undefined') {                                            //if there is no short description
                var match = body.desc.match(/^(.*?)[.?!]\s(?=[A-Z])/g) || [body.desc];              //grabs the first sentence in the long description, or entire long description
                body.shortDesc = match[0];
            }

            if (files.length == 1) {                                                                //if only one file
                filename = filename + '.' + mime.extension(files[0].mime);
                body.mime = files[0].mime;                                                          //sets the body mime from the file mime

                filename = writeFile(filename, files[0].data, path);
            } else {                                                                                //if multiple
                var zipFile = zipFiles(files);                                                      //zips the files
                filename = filename + '.zip';
                body.mime = 'application/zip';

                filename = writeFile(filename, zipFile.generate({compression: "DEFLATE"}), path);
            }

            if (body.newType) {                                                                     //if you need to create a new Download Type i.e. one didn't already exist
                db.downloads.types.insert([body.type]).then(function (data) {                       //creates a new download type in the database
                    var id = data[0].insertId;

                    return insertDownload(id, now, body, filename, res);                            //then inserts the download info to the database

                }).catch(function (err) {
                    console.error(err);
                })
            } else {                                                                                //otherwise
                db.downloads.types.query([body.type]).then(function (data) {                        //gets the download type id from the database
                    var id = data[0][0].typeId;

                    return insertDownload(id, now, body, filename, res);
                }).catch(function (err) {
                    console.error(err);
                })
            }
        });

/**
 *
 * @param typeId
 * @param now current time in mysql format
 * @param body body object
 * @param path path of the written file
 * @param res express response object
 * @returns {*} promise
 */
function insertDownload(typeId, now, body, path, res) {
    return db.downloads.insert([                                                                    //inserts the info to the db
        typeId, body.name, body.desc, body.shortDesc,
        path, now, body.mime
    ]).then(function (data) {                                                                       //then gets the inserted info to return to client
        db.downloads.query([data[0].insertId]).then(function (data2) {
            var types = {};                                                                         //create type object
            delete data2[0][0].filePath;                                                            //delete the file path off of the object, since not needed on client
            //delete data2[0][0].downloadType;
            data2[0][0].fileType = mime.extension(data2[0][0].mimeType);

            types[body.type] = [];
            types[body.type].push(data2[0][0]);

            res.status(201).location('api/downloads/' + data[0].insertId);
            res.json(types);
        })
    });
}

/**
 * Writes a file to the server
 * @param filename file name
 * @param data file data
 * @param {string} path location of the downloads dir
 * @returns {string} path of the written file
 */
function writeFile(filename, data, path){
    filename = path + sanitize(filename);

    fs.writeFile(filename, data, 'base64', function (err) {
        if (err) console.error(err);
    });

    return filename;
}

/**
 * Zips an array of files
 * @param files array of base64 file objects
 * @returns {JSZip|exports|module.exports} zip file
 */
function zipFiles(files) {
    var zipFile = new zip();
    var nameArr = [];

    for (var i = 0; i < files.length; i++) {
        var name = checkName(files[i].name, nameArr);
        nameArr.push(name);

        zipFile.file(name, files[i].data, {base64: true});
    }

    return zipFile;
}

/**
 * Creates a unique filename by incrementing appended numbers
 * @param {string} name name to check
 * @param {Array} nameArr array of existing names
 * @returns {string} valid name
 */
function checkName(name, nameArr){
                                                                                                        //creates a a string in the format 'name 1.ext'
    if (nameArr.indexOf(name) !== -1) {

        // declarations up here aren't really necessary
        // b/c of javascript's block scope, but best to follow convention
        var num = '';
        var ext = '';
        if (name.indexOf('.') !== -1) {                                                                 //if the name has an extension
            var arr = name.substring(0, name.lastIndexOf(".")).split(" ");                              //grab all but extension, and split at a space
            ext = name.substring(name.lastIndexOf("."), name.length);                                   //grab extension

            if (arr.length > 1 && isNumber(arr[arr.length - 1])) {                                      //if there was a space and the last index is a number
                num = parseInt(arr.pop()) + 1;                                                          //increment the number and save
            }

            name = arr.join(" ");                                                                       //rejoin the name array (helps if there were multiple spaces)
        } else {
            var arr = name.split(" ");                                                                  //split on space

            if (arr.length > 1 && isNumber(arr[arr.length - 1])) {                                      //same as above
                num = parseInt(arr.pop()) + 1;
            }

            name = arr.join(" ");
        }

        var fullname = name + " " + (num || 1) + ext;                                                   //append name, one space, number if exists or 1, extension (which may be text or empty string)
        return checkName(fullname, nameArr);                                                            //recursion!!! call the function again to check if the new name exists
    } else
        return name;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = router;