var express = require('express');
var router = express.Router();
var moment = require('moment');
var getSlug = require('speakingurl');
var expressJwt = require('express-jwt');
var mySecret = require('../utility/secret.js');
var Server = require('../utility/server.js');
var db = new Server('articles');

router.post('/', expressJwt({secret: mySecret}), function(req, res, next) {
    var article = req.body;
    var now = moment().format("YYYY-MM-DD");
    var datetime = moment().format("YYYY-MM-DD HH:mm:ss");

    if (typeof(article.description) == 'undefined') {
        article.description = getDescription(article.body);
    }

    var urlSlug = getSlug(article.title);

    //recursive function to handle duplicate dates and urlslugs (very unlikely, but it's best to be safe)
    (function insert(iterations) {
        db.articles.insert([
            article.title, article.author, now, datetime,
            article.description, article.body, urlSlug, null
        ]).then(function (data) {
            res.status(201).location('/api/articles/' + now + '/' + urlSlug).send();
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
            if (err) { return next(err) }
        });
    })(0);
});

router.get('/:date/:urlSlug', function(req, res, next) {
    var date = moment(req.params.date).format('YYYY-MM-DD');
    var slug = req.params.urlSlug;

    db.articles.query([date, slug]).then(function(data) {
        res.json(data[0][0]);
    }).catch(function(err) {
        if (err) return next(err);
    });
});

router.get('/', function(req, res, next) {
   db.articles.queryAll().then(function(data) {
       res.json(data[0]);
   }).catch(function(err) {
       if (err) return next(err);
   });
});

router.put('/:date/:urlSlug', function(req, res, next) {
    var date = moment(req.params.date).format('YYYY-MM-DD');
    var slug = req.params.urlSlug;
    var article = req.body;
    var updateObj = {};
    var validKeys = ["title", "author", "description", "body"];

    if (typeof(req.body.description) == 'undefined') {
        req.body.description = getDescription(req.body.body);
    }

    validKeys.forEach(function(key) {
        if (article[key]) {
            updateObj[key] = article[key];
        }
    });


    db.articles.update([
        updateObj,
        date,
        slug
    ]).then(function(data) {
        res.status(200).send("Updated " + data.affectedRows + " rows");
    }).catch(function(err) {
        if (err) return next(err);
    })
});

router.delete('/:date/:urlSlug', function(req, res, next) {
    var date = moment(req.params.date).format('YYYY-MM-DD');
    var slug = req.params.urlSlug;

    db.articles.delete([date, slug]).then(function(data) {
        res.status(204).send();
    }).catch(function(err) {
        if (err) return next(err);
    })
});

function getDescription(body) {
    var match = body.match(/(^[^#\n]+)/gm);                     // matches the first paragraph that isn't a header
    return match[0] || body;
}

module.exports = router;