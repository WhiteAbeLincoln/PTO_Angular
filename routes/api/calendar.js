var express = require('express');
var router = express.Router();
var moment = require('moment');
var json2csv = require('json2csv');
var expressJwt = require('express-jwt');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var Server = require('../utility/server.js');
var db = new Server('calendar');

router.post('/', expressJwt({secret: mySecret}), function(req, res, next) {
    try {
        var date = moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
    } catch (err) {
        return next(err);
    }
    db.calendar.insert([req.body.name, date, req.body.location, req.body.contact]).then(function(data) {
        res.status(201).location('api/calendar/' + data[0].insertId).send();
    }).catch(function(err) {

        if (err) return next(err);
    })
});

router.get('/', function(req, res, next) {
    var ids = [];
    var fields = ['id','name','date','location','contact'];

    if (req.query["ids"]) {
        ids = req.query["ids"].split(',');
    }


    db.calendar.queryAll().then(function(data) {
        var newFiltered = data[0].filter(function(el){
            for (var i=0; i < ids.length; i++) {
                if (el.id == ids[i]){
                    return true;
                }
            }
            //if ids is an array of length 0, always returns true, resulting in the original array;
            return !ids.length;
        });

        switch (req.query.mode) {
            case "csv":
                json2csv({ data: newFiltered, fields: fields }, function(err, csv) {
                    if (err) return next(err);
                    res.attachment('export.csv').send(csv);
                });
                break;
            default:
                res.json(newFiltered);
        }
    }).catch(function(err) {
        if (err) return next(err);
    })
});

router.get('/:id', function(req, res, next) {
    db.calendar.query([req.params.id]).then(function(data) {
        switch (req.query.mode) {
            case "csv":
                json2csv({
                        data: data[0],
                        fields: [
                            'id',
                            'name',
                            'date',
                            'location',
                            'contact'
                        ]},
                    function(err, csv) {
                        if (err) return next(err);
                        res.attachment('export.csv').send(csv);
                    }
                );
                break;
            default:
                res.json(data[0][0]);
        }
    }).catch(function(err) {
        if (err) return next(err);
    })
});

router.delete('/:id', expressJwt({secret: mySecret}), function(req, res, next) {
    db.calendar.delete([req.params.id]).then(function(data) {
        res.status(204).send();
    }).catch(function(err) {
        if (err) return next(err);
    });
});

router.delete('/', expressJwt({secret: mySecret}), function(req, res, next) {
    var ids = [];
    if (req.query["ids"]) {
        ids = req.query["ids"].split(',');

        ids.forEach(function(id) {
            db.calendar.delete([id]).then(function(data) {

            }).catch(function(err) {
                if (err) return next(err);
            });
        });

        res.status(204).send('Deleted ids ' + req.query["ids"]);
    } else {
        // should I delete the entire collection?
        db.calendar.deleteAll().then(function(data) {
            res.status(204).send();
        }).catch(function(err) {
            if (err) return next(err);
        });
    }
});

module.exports = router;