var express = require('express');
var router = express.Router();
var moment = require('moment');
var getSlug = require('speakingurl');
var expressJwt = require('express-jwt');
var mySecret = 'd20042648ef8387611f9700ae50ee4dd05a3fc2410d9029a76a6e17d7873ef31abc7e2c43f6c7aac3c0d1c6be6afd996271c7c6d83f38e01fec0898fc8eac9e09ba835943734552973737384dee884e008675cd5974cd404c819b5720cf6721f702752a8ddb573c44a4b24fd9850ca756d7fb29a305c9450f151d31d0aed573e5a0f6dc291a3ab382fab5369581e4d8a8769cfbcc0521ace83de962e0a0c8449f05738802d784d26d1599eea00a3d88cb60ae0de3ec01721703e42e1a8c9cf99c7467af06bec75bf57a9a2a03d1189bd3d4e6bff49129954c8b834bc872fb83a867d4cebdf5fd0493eb6ac78c622f515ec3ac8838300f71494a52efe7522b8fe';
var Server = require('../utility/server.js');
var db = new Server('articles');

router.post('/', expressJwt({secret: mySecret}), function(req, res, next) {
    var article = req.body;
    var now = moment().format("YYYY-MM-DD");
    var datetime = moment().format("YYYY-MM-DD HH:mm:ss");

    if (typeof(article.description) == 'undefined') {
        var match = article.body.match(/(^[^#\n]+)/gm);                     // matches the first paragraph that isn't a header
        article.description = match[0];
    }

    var urlSlug = getSlug(article.title);

    //recursive function to handle duplicate dates and urlslugs (very unlikely, but it's best to be safe)
    (function insert(iterations) {
        db.articles.insert([
            article.title, article.author, now, datetime,
            article.description, article.body, urlSlug, null
        ]).then(function (data) {
            res.status(201).location()
        }).catch(function (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                iterations++;
                if (iterations > 1) {
                    var slugs = urlSlug.split('-');                         // splits the slug at what used to be spaces
                    slugs.pop();                                            // pops the last one off, since we know its a number
                    urlSlug = slugs.join('-');                              // rejoins array as a string
                }

                urlSlug = urlSlug + '-' + iterations;                       // now it does the appending

                return insert(iterations);                                  // tries to insert with the new slug
            }
            return next(err);
        });
    })(0);
});

router.get('/:date/:urlSlug', function(req, res, next) {
    var date = moment(req.params.date).format('YYYY-MM-DD');
    var slug = req.params.urlSlug;

    db.articles.query([date, slug]).then(function(data) {
        res.json(data[0][0]);
    }).catch(function(err) {
        return next(err);
    });
});

router.get('/', function(req, res, next) {
   db.articles.queryAll().then(function(data) {
       res.json(data[0]);
   }).catch(function(err) {
       return next(err);
   });
});

module.exports = router;