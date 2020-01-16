'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Home = mongoose.model('Home'),
    Product = mongoose.model('Product');

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
                    "background_img": "https://res.cloudinary.com/hml20oe33/image/upload/v1576748337/catalog/S__20217883_rf1cco.jpg"
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

    xit('should be Home get by id', function (done) {

        var product1 = new Product({
            "sku": 'sku',
            "name": 'Vivo v13 Pro Crystal Sky RAM 8 GB ROM 128 GB',
            "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
            "sale_price_percentage": "50%",
            "sale_price": {
                "price": 5000,
                "currency": "฿"
            },
            "sale_price_text": "฿5,000",
            "regular_price": {
                "price": 10000,
                "currency": "฿"
            },
            "regular_price_text": "฿10,000",
            "installment": {
                "price": 1000,
                "period": 10,
                "currency": "฿"
            },
            "installment_price_text": "฿1,000",
            "categorys": ["bedroom", "restroom"]
        })

        product1.save(function (err, product) {
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
                console.log(product)
                request(app)
                    .get('/api/homes/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.slides[0].background_color, mockup.slides[0].background_color);
                        assert.equal(resp.data.slides[0].image, mockup.slides[0].image);
                        assert.equal(resp.data.slides[1].background_color, mockup.slides[1].background_color);
                        assert.equal(resp.data.slides[1].image, mockup.slides[1].image);
                        assert.equal(resp.data.menus[0].icon_menu, mockup.menus[0].icon_menu);
                        assert.equal(resp.data.menus[0].name_menu, mockup.menus[0].name_menu);
                        assert.equal(resp.data.menus[1].icon_menu, mockup.menus[1].icon_menu);
                        assert.equal(resp.data.menus[1].name_menu, mockup.menus[1].name_menu);
                        assert.equal(resp.data.blocks[0].name, mockup.blocks[0].name);
                        assert.equal(resp.data.blocks[0].background_img, mockup.blocks[0].background_img);
                        assert.equal(resp.data.blocks[1].name, mockup.blocks[1].name);
                        assert.equal(resp.data.blocks[1].background_img, mockup.blocks[1].background_img);
                        done();
                    });
            });
        })

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
                assert.equal(resp.status, 200);
                assert.equal(resp.data.slides[0].background_color, mockup.slides[0].background_color);
                assert.equal(resp.data.slides[0].image, mockup.slides[0].image);
                assert.equal(resp.data.slides[1].background_color, mockup.slides[1].background_color);
                assert.equal(resp.data.slides[1].image, mockup.slides[1].image);
                assert.equal(resp.data.menus[0].icon_menu, mockup.menus[0].icon_menu);
                assert.equal(resp.data.menus[0].name_menu, mockup.menus[0].name_menu);
                assert.equal(resp.data.menus[1].icon_menu, mockup.menus[1].icon_menu);
                assert.equal(resp.data.menus[1].name_menu, mockup.menus[1].name_menu);
                assert.equal(resp.data.blocks[0].name, mockup.blocks[0].name);
                assert.equal(resp.data.blocks[0].background_img, mockup.blocks[0].background_img);
                assert.equal(resp.data.blocks[1].name, mockup.blocks[1].name);
                assert.equal(resp.data.blocks[1].background_img, mockup.blocks[1].background_img);
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
                    "slides": [
                        {
                            "background_color": "rgb(217, 212, 2111111)",
                            "image": "update.jpg"
                        },
                        {
                            "background_color": "rgb(154, 144, 135222222);",
                            "image": "update.jpg"
                        }
                    ]
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
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.slides[0].background_color, update.slides[0].background_color);
                        assert.equal(resp.data.slides[0].image, update.slides[0].image);
                        assert.equal(resp.data.slides[1].background_color, update.slides[1].background_color);
                        assert.equal(resp.data.slides[1].image, update.slides[1].image);
                        assert.equal(resp.data.menus[0].icon_menu, mockup.menus[0].icon_menu);
                        assert.equal(resp.data.menus[0].name_menu, mockup.menus[0].name_menu);
                        assert.equal(resp.data.menus[1].icon_menu, mockup.menus[1].icon_menu);
                        assert.equal(resp.data.menus[1].name_menu, mockup.menus[1].name_menu);
                        assert.equal(resp.data.blocks[0].name, mockup.blocks[0].name);
                        assert.equal(resp.data.blocks[0].background_img, mockup.blocks[0].background_img);
                        assert.equal(resp.data.blocks[1].name, mockup.blocks[1].name);
                        assert.equal(resp.data.blocks[1].background_img, mockup.blocks[1].background_img);
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
        // Product.remove().exec(done);
    });

});