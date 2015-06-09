var express = require('express');
var expressJwt = require('express-jwt');
var json2csv = require('json2csv');
var router = express.Router();
var Server = require('./utility/server.js');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
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

module.exports.secret = mySecret;
module.exports.router = router;
