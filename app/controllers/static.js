var express = require('express')
router = express.Router();

/**
 * non-api requests will be handled by router 
 */
module.exports = function (app) {
    app.use('/', router);
};

/**
 * Render index view for home page
 */
router.get('/', function (req, res, next) {

    res.render('index', {});
});