'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Notice = mongoose.model('Notice');

var credentials,
    token,
    mockup;

describe('Notice CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "warranty_name": 'name',
            "warranties_lists": [
                {
                    "title": "ชำระเงิน",
                    "subtitle": "ผ่านแอปและธนาคาร"
                },
                {
                    "title": "คืนสินค้า",
                    "subtitle": "รับคืนเมื่อจำเป็น"
                }
            ],
            "aftersales_name": "หลังการขาย",
            "aftersales_lists": [
                {
                    "title": "1. ไม่คืน"
                },
                {
                    "title": "1. ไม่จ่าย"
                }
            ]
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Notice get use token', (done) => {
        request(app)
            .get('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Notice get by id', function (done) {

        request(app)
            .post('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/notices/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.warranty_name, mockup.warranty_name);
                        assert.equal(resp.data.warranties_lists[0].title, mockup.warranties_lists[0].title);
                        assert.equal(resp.data.warranties_lists[0].subtitle, mockup.warranties_lists[0].subtitle);
                        assert.equal(resp.data.warranties_lists[1].title, mockup.warranties_lists[1].title);
                        assert.equal(resp.data.warranties_lists[1].subtitle, mockup.warranties_lists[1].subtitle);
                        assert.equal(resp.data.aftersales_name, mockup.aftersales_name);
                        assert.equal(resp.data.aftersales_lists[0].title, mockup.aftersales_lists[0].title);
                        assert.equal(resp.data.aftersales_lists[1].title, mockup.aftersales_lists[1].title);
                        done();
                    });
            });

    });

    it('should be Notice post use token', (done) => {
        request(app)
            .post('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.warranty_name, mockup.warranty_name);
                assert.equal(resp.data.warranties_lists[0].title, mockup.warranties_lists[0].title);
                assert.equal(resp.data.warranties_lists[0].subtitle, mockup.warranties_lists[0].subtitle);
                assert.equal(resp.data.warranties_lists[1].title, mockup.warranties_lists[1].title);
                assert.equal(resp.data.warranties_lists[1].subtitle, mockup.warranties_lists[1].subtitle);
                assert.equal(resp.data.aftersales_name, mockup.aftersales_name);
                assert.equal(resp.data.aftersales_lists[0].title, mockup.aftersales_lists[0].title);
                assert.equal(resp.data.aftersales_lists[1].title, mockup.aftersales_lists[1].title);
                done();
            });
    });

    it('should be notice put use token', function (done) {

        request(app)
            .post('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    warranty_name: 'name update'
                }
                request(app)
                    .put('/api/notices/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.warranty_name, update.warranty_name);
                        assert.equal(resp.data.warranties_lists[0].title, mockup.warranties_lists[0].title);
                        assert.equal(resp.data.warranties_lists[0].subtitle, mockup.warranties_lists[0].subtitle);
                        assert.equal(resp.data.warranties_lists[1].title, mockup.warranties_lists[1].title);
                        assert.equal(resp.data.warranties_lists[1].subtitle, mockup.warranties_lists[1].subtitle);
                        assert.equal(resp.data.aftersales_name, mockup.aftersales_name);
                        assert.equal(resp.data.aftersales_lists[0].title, mockup.aftersales_lists[0].title);
                        assert.equal(resp.data.aftersales_lists[1].title, mockup.aftersales_lists[1].title);
                        done();
                    });
            });

    });

    it('should be notice delete use token', function (done) {

        request(app)
            .post('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/notices/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be notice get not use token', (done) => {
        request(app)
            .get('/api/notices')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be notice post not use token', function (done) {

        request(app)
            .post('/api/notices')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be notice put not use token', function (done) {

        request(app)
            .post('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/notices/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be notice delete not use token', function (done) {

        request(app)
            .post('/api/notices')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/notices/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Notice.deleteMany().exec(done);
    });

});