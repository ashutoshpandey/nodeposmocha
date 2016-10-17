var db = require("../db"),                   // for db
    express = require('express'),                   // for express
    jwt = require('jsonwebtoken'),                  // for json web tokens
    encryption = require('../util/encryption'),     // for string encryption/decryption
    bodyParser = require('body-parser'),            // for parsing body
    methodOverride = require('method-override'),    // for reading/updating request body
    apiRouter = express.Router();

/**
 * Remove unwanted data from request body
 */
apiRouter.use(bodyParser.urlencoded({extended: true}));
apiRouter.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

/**
 * All requests with /api will be handled by apiRouter
 */
module.exports = function (app) {
    app.use('/api', apiRouter);
};

/**
 * Route middleware, checks for token on /api urls
 */
if(false) {
    apiRouter.use(function (req, res, next) {

        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {

            var secret_key = req.session.secret;

            if (secret_key) {

                secret_key = encryption.decrypt(secret_key);

                jwt.verify(token, secret_key, function (err, decoded) {
                    if (err) {
                        return res.json({success: false, message: 'Failed to authenticate token.'});
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                });
            }
            else
            // if there is no token
                return res.status(403).send({
                    success: false,
                    message: 'not logged'
                });

        } else {

            // if there is no token
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });
}

/************* rest api urls for articles ****************************/
/**
 * Returns all articles
 */
apiRouter.get('/articles', function (req, res, next) {

    db.select('id', 'title', 'text').from('articles').then(function (articles) {
        res.setHeader('Content-Type', 'application/json');

        var data = {articles: articles, message: articles.length > 0 ? 'found' : 'empty'};

        res.send(JSON.stringify(data));
    });
});

/**
 * Returns single article
 * @param {integer} id
 */
apiRouter.get('/articles/:id', function (req, res, next) {

    db.select('id', 'title', 'text').from('articles').where('id', req.params.id).then(function (articles) {
        res.setHeader('Content-Type', 'application/json');

        if (articles && articles.length > 0) {

            var article = articles[0];

            var data = {article: article, message: 'found'};

            res.send(JSON.stringify(data));
        }
        else {
            var data = {article: null, message: 'empty'};

            res.send(JSON.stringify(data));
        }
    });
});

/**
 * Remove an article
 * @param {integer} id
 */
apiRouter.delete('/articles/:id', function (req, res, next) {

    db('articles').where('id', req.params.id).del().then(function (count) {
        res.setHeader('Content-Type', 'application/json');

        if (count > 0) {

            var data = {count: count, message: 'found'};

            res.send(JSON.stringify(data));
        }
        else {
            var data = {count: 0, message: 'empty'};

            res.send(JSON.stringify(data));
        }
    });
});

/**
 * Create new article
 * @param {string} title
 * @param {string} url
 * @param {string} text
 */
apiRouter.post('/articles', function (req, res, next) {

    var currentDate = new Date();

    var article = {
        title: req.body.title,
        url: req.body.url,
        text: req.body.text,
        created_at: currentDate,
        updated_at: currentDate
    };

    db.insert(article).into('articles').returning('id').then(function (id) {

        res.setHeader('Content-Type', 'application/json');

        res.send(JSON.stringify({id: id, message: 'done'}));
    });
});

/**
 * Update an article
 * @param {integer} id
 * @param {string} title
 * @param {string} url
 * @param {string} text
 */
apiRouter.put('/articles/:id', function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    var currentDate = new Date();

    db('articles')
        .where('id', req.params.id)
        .update({
            title: req.body.title,
            url: req.body.url,
            text: req.body.text,
            updated_at: currentDate
        })
        .then(function (count) {
            res.send(JSON.stringify({count: count, message: 'found'}));
        });
});