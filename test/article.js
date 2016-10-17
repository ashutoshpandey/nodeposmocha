// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../app'),
    db = require('../app/db');

var should = chai.should();

chai.use(chaiHttp);

var id;

describe('Article URLs', function () {

    //Before test we empty the database
    before(function (done) {

        db("articles").del().then(function (count) {
            console.log(count);
        });

        done();
    });

    describe('/POST article', function () {
        it('it should create new article', function (done) {

            chai.request(server)
                .post('/api/articles')
                .send({
                    title: 'test title',
                    url: 'some url',
                    text: 'some text'
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('id');
                    res.body.should.have.property('message');
                    res.body.message.should.equals('done');

                    id = res.body.id;

                    done();
                });
        });
    });

    describe('/PUT article', function () {
        it('it should update article', function (done) {

            chai.request(server)
                .put('/api/articles/' + id)
                .send({
                    title: 'new title',
                    url: 'new url',
                    text: 'new text'
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('count');
                    res.body.should.have.property('message');
                    res.body.message.should.equals('found');
                    done();
                });
        });
    });

    describe('/GET articles', function () {
        it('it should return all articles', function (done) {

            chai.request(server)
                .get('/api/articles')
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('articles');
                    res.body.should.have.property('message');
                    res.body.articles.should.be.a('array');
                    res.body.articles.length.should.be.greaterThan(0);
                    res.body.articles[0].should.have.property('id');
                    res.body.articles[0].should.have.property('title');
                    res.body.articles[0].should.have.property('text');
                    done();
                });
        });
    });

    describe('/GET article', function () {
        it('it should return single article', function (done) {

            chai.request(server)
                .get('/api/articles/' + id)
                .end(function (err, res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('article');
                    res.body.should.have.property('message');
                    res.body.article.should.have.property('id');
                    res.body.article.should.have.property('title');
                    res.body.article.should.have.property('text');
                    done();
                });
        });
    });

    describe('/DELETE article', function () {
        it('it should delete single article', function (done) {
            chai.request(server)
                .delete('/api/articles/' + id)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('count');
                    res.body.should.have.property('message');
                    res.body.count.should.be.greaterThan(0);
                    res.body.message.should.be.equals('found');
                    done();
                });
        });
    });

});