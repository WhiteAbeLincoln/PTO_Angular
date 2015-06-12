var express = require('express');
var expressJwt = require('express-jwt');
var json2csv = require('json2csv');
var router = express.Router();
var Server = require('./utility/server.js');
var db = new Server('api');

router.get('/',
    function (req, res) {
        res.status(404).end();
    }
);

router.use('/downloads', require('./api/downloads.js'));

router.get('/downloadTypes', function(req, res){
    db.downloads.types.queryAll().then(function(data){
        res.json(data[0]);
    }).catch(function(err){
        console.log(err);
    });
});

router.use('/members', require('./api/members.js'));

router.use('/scholarships', require('./api/scholarships.js'));

router.use('/admin', require('./api/admin.js'));

router.use('/articles', require('./api/articles.js'));

router.use('/calendar', require('./api/calendar.js'));

module.exports = router;
