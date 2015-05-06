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
var db = new Server();

    router.get('/', function (req, res) {
        db.downloads.queryAll().then(function (data) {
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
                if (typeof (types[array[i].downloadType]) == "undefined") {
                    types[array[i].downloadType] = [];
                }
                types[array[i].downloadType].push(download);
            }
            res.json(types);
        }).catch(function (error) {
            console.log(error);
        });
    });

    router.get('/:id', function (req, res) {
        db.downloads.query([req.params.id]).then(function (data) {
            var download = data[0][0];

            if (req.query.mode == "json") {
                delete data[0][0].filePath;
                res.send(data[0]);
            } else if (req.query.mode == "view") {
                var options = {
                    root: __dirname + '/../',
                    dotfiles: 'deny'
                };
                res.sendFile(download.filePath, options, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(err.status).end();
                    } else {
                        console.log("Sent: ", download.filePath);
                    }
                });
            } else {
                var filename = download.name + '.' + mime.extension(download.mimeType);
                res.download(download.filePath, sanitize(filename), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('downloaded ' + filename + ' with id ' + req.params.id);
                    }
                });
            }
        }).catch(function (err) {
            if (err.name == 'TypeError') {
                res.status(400).end(err.message);
            } else {
                res.status(500).end(err.message);
            }
        });
    });

    router.delete('/:id', function (req, res) {
        db.downloads.query([req.params.id]).then(function (data) {
            var download = data[0][0];

            //deletes the file from the filesystem
            fs.unlink(download.filePath, function (err) {
                if (err) console.log(err);
            });

            //deletes the database entry
            return db.downloads.delete([req.params.id])
        }).then(function (data) {
            res.status(204).send();
        }).catch(function (err) {
            console.log(err);
        });
    });

module.exports = router;