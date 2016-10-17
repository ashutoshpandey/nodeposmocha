// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var db = require('../app/db');

var should = chai.should();

chai.use(chaiHttp);

describe('User URLs', function () {

    //Before test we empty the database
    before(function (done) {

        db("users").del().then(function (count) {
            console.log(count);
        });

        done();
    });
    
    describe('/POST user', function () {
        it('it should create new user', function (done) {
            chai.request(server)
                .post('/users')
                .send({
                    name: 'Ashutosh Pandey',
                    username: 'ashutosh',
                    password: 'a'
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('id');
                    res.body.should.have.property('message');
                    res.body.message.should.equals('done');
                    done();
                });
        });
    });

    describe('/POST authenticate', function () {
        it('it should check user login', function (done) {

            chai.request(server)
                .post('/authenticate')
                .send({
                    username: 'ashutosh',
                    password: 'a'
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('success');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

});