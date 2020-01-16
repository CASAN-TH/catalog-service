'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Home = mongoose.model('Home');

var credentials,
    token,
    mockup;

describe('Home CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "slides": [
                {
                    "background_color": "rgb(217, 212, 211)",
                    "image": "https://res.cloudinary.com/hml20oe33/image/upload/v1576748333/catalog/S__20217887_hjmisc.jpg"
                },
                {
                    "background_color": "rgb(154, 144, 135);",
                    "image": "https://res.cloudinary.com/hml20oe33/image/upload/v1576748337/catalog/S__20217883_rf1cco.jpg"
                }
            ],
            "menus": [
                {
                    "icon_menu": "https://pub.thisshop.com/shop/block/2019122/15757151_1575254343134.png",
                    "name_menu": "Global Mall"
                },
                {
                    "icon_menu": "https://pub.thisshop.com/shop/block/2019122/28362678_1575254354634.png",
                    "name_menu": "Cash Reward"
                }
            ],
            "blocks": [
                {
                    "name": "ห้องนอน",
                    "background_img": "https://res.cloudinary.com/hml20oe33/image/upload/v1576748337/catalog/S__20217883_rf1cco.jpg",
                    "products": [
                        {
                            "name": "Vivo v13 Pro Crystal Sky RAM 8 GB ROM 128 GB",
                            "image": "https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg",
                            "discount": "22% off",
                            "price": {
                                "amount": "12,999.00",
                                "currency": "฿"
                            },
                            "installment": {
                                "amount": "785.77",
                                "period": "x 18mo",
                                "currency": "฿"
                            }
                        },
                        {
                            "name": "Vivo v10 Pro Crystal Sky RAM 8 GB ROM 128 GB",
                            "image": "https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/1_k5dfsy.jpg",
                            "discount": "22% off",
                            "price": {
                                "amount": "12,999.00",
                                "currency": "฿"
                            },
                            "installment": {
                                "amount": "785.77",
                                "period": "x 18mo",
                                "currency": "฿"
                            }
                        }
                    ]
                },
                {
                    "name": "ห้องนอนเด็ก",
                    "background_img": "https://res.cloudinary.com/hml20oe33/image/upload/v1576748333/catalog/S__20217887_hjmisc.jpg"
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

    it('should be Home get use token', (done) => {
        request(app)
            .get('/api/homes')
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

    it('should be Home get by id', function (done) {

        request(app)
            .post('/api/homes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/homes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // assert.equal(resp.status, 200);
                        // assert.equal(resp.data.name, mockup.name);
                        done();
                    });
            });

    });

    it('should be Home post use token', (done) => {
        request(app)
            .post('/api/homes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                // console.log(resp.data.blocks[0].products)
                // assert.equal(resp.data.name, mockup.name);
                done();
            });
    });

    it('should be home put use token', function (done) {

        request(app)
            .post('/api/homes')
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
                    .put('/api/homes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    it('should be home delete use token', function (done) {

        request(app)
            .post('/api/homes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/homes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be home get not use token', (done) => {
        request(app)
            .get('/api/homes')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be home post not use token', function (done) {

        request(app)
            .post('/api/homes')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be home put not use token', function (done) {

        request(app)
            .post('/api/homes')
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
                    .put('/api/homes/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be home delete not use token', function (done) {

        request(app)
            .post('/api/homes')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/homes/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Home.remove().exec(done);
    });

});