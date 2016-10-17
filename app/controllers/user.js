var db = require("../db"),
    express = require('express'),
    jwt = require('jsonwebtoken'),
    uuid = require('uuid'),
    encryption = require('../util/encryption'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var router = express.Router();

router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

module.exports = function (app) {
    app.use('/', router);
};

/**
 * Create new user
 * @param {string} name
 * @param {string} username
 * @param {string} password
 */
router.post('/users', function (req, res, next) {

    var currentDate = new Date();

    var user = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        secret_key: uuid.v4(),
        created_at: currentDate,
        updated_at: currentDate
    };

    db.insert(user).into('users').then(function (id) {

        res.setHeader('Content-Type', 'application/json');

        res.send(JSON.stringify({id: id, message: 'done'}));
    });
});

/**
 * User login
 * @param {string} username
 * @param {string} password
 */
router.post('/authenticate', function (req, res) {

    db.select('id', 'secret_key')
        .from('users')
        .where({
            'username': req.body.username,
            'password': req.body.password
        })
        .then(function (users) {

            res.setHeader('Content-Type', 'application/json');

            if (users && users.length > 0) {

                var user = users[0];

                var secret_key = user.secret_key;
                var token = jwt.sign(user, secret_key, {
                    expiresIn: 1440 // expires in 24 hours
                });

                req.session.secret = encryption.encrypt(secret_key);

                res.json({
                    success: true,
                    message: 'success',
                    token: token
                });
            }
            else {
                res.json({success: false, message: 'wrong'});
            }
        });
});
