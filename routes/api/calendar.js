var express = require('express');
var router = express.Router();
var moment = require('moment');
var json2csv = require('json2csv');
var expressJwt = require('express-jwt');
var Q = require('q');
var mySecret = require('../utility/secret.js');
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

router.delete('/', function(req, res, next) {
    var ids = [];
    if (req.query["ids"]) {
        var promises = [];
        ids = req.query["ids"].split(',');

        ids.forEach(function(id) {
            promises.push(db.calendar.delete([id]));
        });

        Q.all(promises).catch(function(err) {
            if (err) return next(err);
        }).done(function(values) {
            var affected = 0;

            values.forEach(function(val) {
                affected += val.affectedRows;
            });

            res.status(204).send();
        })


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