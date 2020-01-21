'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Product = mongoose.model('Product');

var credentials,
    token,
    mockup;

describe('Product CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            "sku": 'sku',
            "shop": {
                "shop_id": "shop001",
                "shop_name": "shopTest",
                "shop_image": "image.jpg"
            },
            "name": 'Vivo v13 Pro Crystal Sky RAM 8 GB ROM 128 GB',
            "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
            "options": [
                {
                    "name": "color",
                    "option_lists": [
                        {
                            "lists_name": "green"
                        },
                        {
                            "lists_name": "yellow",
                            "lists_price": 3000
                        }
                    ]
                },
                {
                    "name": "size",
                    "option_lists": [
                        {
                            "lists_name": "M",
                            "lists_price": 3000
                        },
                        {
                            "lists_name": "L",
                            "lists_price": 5200
                        }
                    ]
                }
            ],
            "sale_price_percentage": 50,
            "sale_avaliable": true,
            "sale_price": {
                "price": 5000,
                "currency": "฿"
            },
            "regular_price": {
                "price": 10000,
                "currency": "฿"
            },
            "down_payment": {
                "price": 1000,
                "currency": "฿"
            },
            "installment": {
                "price": 222.222222222223,
                "period": 18,
                "currency": "฿"
            },
            "down_payment_lists": [20, 30, 40, 50],
            "periods_lists": [3, 6, 9, 12, 18],
            "categorys": ["bedroom", "restroom"]
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

    it('should be Product get use token', (done) => {
        request(app)
            .get('/api/products')
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

    it('should be Product get by id', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/products/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.sku, mockup.sku);
                        assert.equal(resp.data.shop.shop_id, mockup.shop.shop_id);
                        assert.equal(resp.data.shop.shop_name, mockup.shop.shop_name);
                        assert.equal(resp.data.name, mockup.name);
                        assert.equal(resp.data.images[0], mockup.images[0]);
                        assert.equal(resp.data.sale_price_percentage, mockup.sale_price_percentage);
                        assert.equal(resp.data.sale_price.price, mockup.sale_price.price);
                        assert.equal(resp.data.sale_price.currency, mockup.sale_price.currency);
                        assert.equal(resp.data.sale_price_text, "฿5,000.00");
                        assert.equal(resp.data.regular_price.price, mockup.regular_price.price);
                        assert.equal(resp.data.regular_price.currency, mockup.regular_price.currency);
                        assert.equal(resp.data.regular_price_text, "฿10,000.00");
                        assert.equal(resp.data.installment.price, mockup.installment.price);
                        assert.equal(resp.data.installment.period, mockup.installment.period);
                        assert.equal(resp.data.installment.currency, mockup.installment.currency);
                        assert.equal(resp.data.installment_price_text, "฿222.22");
                        assert.equal(resp.data.down_payment.price, mockup.down_payment.price);
                        assert.equal(resp.data.down_payment.currency, mockup.down_payment.currency);
                        assert.equal(resp.data.down_payment_text, "฿1,000.00");
                        done();
                    });
            });

    });

    it('should be Product post use token', (done) => {
        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.sku, mockup.sku);
                assert.equal(resp.data.shop.shop_id, mockup.shop.shop_id);
                assert.equal(resp.data.shop.shop_name, mockup.shop.shop_name);
                assert.equal(resp.data.name, mockup.name);
                assert.equal(resp.data.images[0], mockup.images[0]);
                assert.equal(resp.data.sale_price_percentage, mockup.sale_price_percentage);
                assert.equal(resp.data.sale_price.price, mockup.sale_price.price);
                assert.equal(resp.data.sale_price.currency, mockup.sale_price.currency);
                assert.equal(resp.data.sale_price_text, "฿5,000.00");
                assert.equal(resp.data.regular_price.price, mockup.regular_price.price);
                assert.equal(resp.data.regular_price.currency, mockup.regular_price.currency);
                assert.equal(resp.data.regular_price_text, "฿10,000.00");
                assert.equal(resp.data.installment.price, mockup.installment.price);
                assert.equal(resp.data.installment.period, mockup.installment.period);
                assert.equal(resp.data.installment.currency, mockup.installment.currency);
                assert.equal(resp.data.installment_price_text, "฿222.22");
                assert.equal(resp.data.down_payment.price, mockup.down_payment.price);
                assert.equal(resp.data.down_payment.currency, mockup.down_payment.currency);
                assert.equal(resp.data.down_payment_text, "฿1,000.00");
                done();
            });
    });

    it('should be product put use token', function (done) {

        request(app)
            .post('/api/products')
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
                    .put('/api/products/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.sku, mockup.sku);
                        assert.equal(resp.data.shop.shop_id, mockup.shop.shop_id);
                        assert.equal(resp.data.shop.shop_name, mockup.shop.shop_name);
                        assert.equal(resp.data.name, update.name);
                        assert.equal(resp.data.images[0], mockup.images[0]);
                        assert.equal(resp.data.sale_price_percentage, mockup.sale_price_percentage);
                        assert.equal(resp.data.sale_price.price, mockup.sale_price.price);
                        assert.equal(resp.data.sale_price.currency, mockup.sale_price.currency);
                        assert.equal(resp.data.sale_price_text, "฿5,000.00");
                        assert.equal(resp.data.regular_price.price, mockup.regular_price.price);
                        assert.equal(resp.data.regular_price.currency, mockup.regular_price.currency);
                        assert.equal(resp.data.regular_price_text, "฿10,000.00");
                        assert.equal(resp.data.installment.price, mockup.installment.price);
                        assert.equal(resp.data.installment.period, mockup.installment.period);
                        assert.equal(resp.data.installment.currency, mockup.installment.currency);
                        assert.equal(resp.data.installment_price_text, "฿222.22");
                        assert.equal(resp.data.down_payment.price, mockup.down_payment.price);
                        assert.equal(resp.data.down_payment.currency, mockup.down_payment.currency);
                        assert.equal(resp.data.down_payment_text, "฿1,000.00");
                        done();
                    });
            });

    });

    it('should be product delete use token', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/products/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be product get not use token', (done) => {
        request(app)
            .get('/api/products')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be product post not use token', function (done) {

        request(app)
            .post('/api/products')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be product put not use token', function (done) {

        request(app)
            .post('/api/products')
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
                    .put('/api/products/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be product delete not use token', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/products/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Product.remove().exec(done);
    });

});