var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Centerville PTO' });
});

router.get('/robots.txt', function(req, res, next) {
    var options = {
        root: __dirname + '/public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent':true
        }
    };

    res.sendFile('robots.txt', options, function(err) {
        if (err) next(err);
    })
});

module.exports = router;
