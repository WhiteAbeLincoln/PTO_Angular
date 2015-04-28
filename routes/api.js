var express = require('express');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var json2csv = require('json2csv');
var Q = require('q');
var myCrypt = require('./utility/crypto.js');
var router = express.Router();
var Server = require('./utility/server.js');
var mime = require('mime');
var fs = require('fs');
var zip = require('jszip');
var sanitize = require('sanitize-filename');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var db = new Server();

router.get('/',
    function (req, res) {
        res.status(404).end();
    }
);

router.get('/downloads/', function(req, res){
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
       console.log(error);
    });
});

router.get('/downloads/:id', function (req, res) {
    db.downloads.query([req.params.id]).then(function(data){
        var download = data[0][0];

        if (req.query.mode == "json"){
            delete data[0][0].filePath;
            res.send(data[0]);
        } else if (req.query.mode == "view") {
            var options = {
                root: __dirname + '/../',
                dotfiles: 'deny'
            };
            res.sendFile(download.filePath, options, function(err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                } else  {
                    console.log("Sent: ", download.filePath);
                }
            });
        } else {
            var filename = download.name + '.' + mime.extension(download.mimeType);
            res.download(download.filePath, sanitize(filename), function(err){
                if (err){
                    console.log(err);
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

router.put('/downloads/:id', expressJwt({secret: mySecret}), function (req, res, next) {
    console.log('updating a download');
});

router.delete('/downloads/:id', expressJwt({secret: mySecret}), function(req, res){
    db.downloads.query([req.params.id]).then(function(data){
        var download = data[0][0];

        //deletes the file from the filesystem
        fs.unlink(download.filePath, function(err){
            if (err) console.log(err);
        });

        //deletes the database entry
        return db.downloads.delete([req.params.id])
    }).then(function(data){
        res.status(204).send();
    }).catch(function(err){
        console.log(err);
    });
});

router.post('/downloads', expressJwt({secret: mySecret}),           //This ones a monster.
function (req, res) {
    var path = 'files/downloads/';
    var body = req.body;
    var filename = body.name + Math.floor(new Date() / 1000); //unix timestamp -- ensures unique filename
    var now = moment().format("YYYY-MM-DD HH:mm:ss");

    //remove mimetype information from data string
    var files = body.files.map(function(file){
        file.data = file.data.split(',')[1];
        return file;
    });

    if (typeof(body.shortDesc) == 'undefined'){       //grabs the first sentence in the long description if short doesn't exist
        var match = body.desc.match(/^(.*?)[.?!]\s(?=[A-Z])/g) || [body.desc];
        body.shortDesc = match[0];
    }

    if (files.length == 1) {
        filename = sanitize(filename + '.' + mime.extension(files[0].type));
        body.mime = files[0].type;

        fs.writeFile(path+filename, files[0].data, 'base64', function(err){
            if (err) console.log(err);
        });
    } else {        //zips the file
        filename = sanitize(filename + '.zip');
        body.mime = 'application/zip';
        var zipFile = new zip();

        for (var i = 0; i < files.length; i++){
            zipFile.file(files[i].name, files[i].data, {base64: true});
        }

        fs.writeFile(path+filename, zipFile.generate({compression: "DEFLATE"}), 'base64', function(err){
           if (err) console.log(err);
        });
    }

    if (body.newType){      //if you need to create a new Download Type i.e. one didn't already exist
        db.downloads.types.insert([body.type]).then(function(data) {
            var type = data[0].insertId;

            db.downloads.insert([
                type,   body.name,  body.desc,  body.shortDesc,
                path+filename,      now,        body.mime
            ]).then(function(data){
                db.downloads.query([data[0].insertId]).then(function(data2) {
                    var types = {};         //create type object
                    delete data2[0][0].filePath; //delete the file path off of the object, since not needed on client
                    delete data2[0][0].downloadType;
                    data2[0][0].fileType = mime.extension(data2[0][0].mimeType);

                    types[body.type] = [];
                    types[body.type].push(data2[0][0]);

                    res.status(201).location('api/downloads/' + data[0].insertId);
                    res.json(types);
                })
            })

        }).catch(function(err){
            console.log(err);
        })
    } else {
        db.downloads.types.query([body.type]).then(function(data){
            var type = data[0][0].typeId;

            db.downloads.insert([
                type,   body.name,  body.desc,  body.shortDesc,
                path+filename,      now,        body.mime
            ]).then(function(data){
                db.downloads.query([data[0].insertId]).then(function(data2) {
                    var types = {};
                    delete data2[0][0].filePath;
                    delete data2[0][0].downloadType;
                    data2[0][0].fileType = mime.extension(data2[0][0].mimeType);

                    types[body.type] = [];
                    types[body.type].push(data2[0][0]);        //inserts an array, and pushes data to it.

                    res.status(201).location('api/downloads/' + data[0].insertId);
                    res.json(types);
                });
            })
        }).catch(function(err){
            console.log(err);
        })
    }
});

router.get('/downloadTypes', function(req, res){
    db.downloads.types.queryAll().then(function(data){
        res.json(data[0]);
    }).catch(function(err){
        console.log(err);
    });
});

/* POST membership form */
router.post('/members',
    function (req, res) {
        var user = req.body.user;
        db.members.insert(
            [user.first, user.last, user.address,
            user.city, user.state, user.postalCode]
        ).then(function(data){
            return Q.all(user.students.map(function(student){
                return db.members.students.insert([data[0].insertId, student.first, student.last, student.grade, student.unit]);
            })).then(function(val){
                var payment = req.body.payment;
                if (payment.amount !== 0)        //for instances when member chooses not to pay
                    return db.members.payments.createCharge(payment);
            }).then(function(card){
                var payment = req.body.payment;
                if (payment.amount !== 0)
                    return db.members.payments.insert([data[0].insertId, card.id, payment.first, payment.last, payment.amount])
            }).then(function(){
                res.status(201).location('api/members/' + data[0].insertId);
                res.send();
            })
        }).catch(function(err){
            if (err.message){
                res.status(400).send(err.message);
                console.log(err.stack);
            }
        });
    }
);

router.get('/members/:id',
    function (req, res) {
        db.members.query([req.params.id]).then(function(data){
            if (req.query.mode == "csv") {
                console.log(data[0]);
                json2csv({
                    data: data[0],
                    fields: [
                        'membershipId',
                        'lastName',
                        'firstName',
                        'address',
                        'city',
                        'state',
                        'zipCode',
                        'studentIds'
                    ]}, function(err, csv) {
                    if (err) console.log(err);
                    res.type('text/csv').send(csv);
                });
            } else {
                res.json(data[0])
            }
        }).catch(function(err){
            console.log(err);
        })
    });

router.get('/members', function(req, res) {
    db.members.queryAll().then(function(data){
        if (req.query.mode == "csv") {
            var json = data[0];
            json2csv({
                data: json,
                fields: [
                    'membershipId',
                    'lastName',
                    'firstName',
                    'address',
                    'city',
                    'state',
                    'zipCode',
                    'studentIds'
                ]}, function(err, csv) {
                if (err) console.log(err);
                res.type('text/csv').send(csv);
            });
        } else {
            res.json(data[0]);
        }
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/member-students/:id', expressJwt({secret: mySecret}), function(req, res){
    db.members.students.query([req.params.id]).then(function(data){
        res.json(data[0])
    }).catch(function(err){
        console.log(err);
    })
});

router.get('/member-students/', expressJwt({secret: mySecret}), function(req, res){
    db.members.students.queryAll().then(function(data){
        res.json(data[0])
    }).catch(function(err){
        console.log(err);
    })
});

router.post('/admin/login', function(req, res){

    db.admin.query([req.body.username]).then(function(data){
        if (data[0].length == 0){       //if there is no user with that username
            res.status(401).send('Incorrect username or password');
            return;
        }
        var user = data[0][0];

        return myCrypt.pbkdf2(req.body.password, user.salt).then(function(key){
            if (user.password === key.toString('base64')){            //correct password
                var profile = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    type: user.type,
                    id: user.adminId,
                    registrationDate: user.registrationDate
                };
                var token = jwt.sign(profile, mySecret);

                res.json({token:token, user: profile});
            } else {
                res.status(401).send('Incorrect password or username');
            }
        });
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/admin/me', function(req, res){
    res.send(req.user);
});


router.post('/admin/register', function(req, res){
    myCrypt.createSalt(512).then(function(data){
        var salt = data.toString('base64');
        return myCrypt.pbkdf2(req.body.password, salt)
            .then(function(key){
                return db.admin.create([
                    req.body.firstName, req.body.lastName,      req.body.email, req.body.type,
                    req.body.username,  key.toString('base64'), salt,           moment().format("YYYY-MM-DD HH:mm:ss")
                ]);

            });
    }).then(function(data){
        console.log(data);
    }).catch(function(err){
        if (err) console.log(err);
    })
});

router.post('/scholars',
    function (req, res) {
        console.log('post to api/scholars');
    }
);


function combineActivities(jsonpack) {
    return jsonpack.communityActivities.map(function (activity) {
        activity.type = "C";
    }) +
    jsonpack.schoolActivities.map(function (activity) {
        activity.type = "S";
    });
}

module.exports.secret = mySecret;
module.exports.router = router;
