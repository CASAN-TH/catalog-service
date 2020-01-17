'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Category = mongoose.model('Category'),
    Product = mongoose.model('Product');

var credentials,
    token,
    mockup;

describe('Category CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            name: 'ห้องนอน'
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

    it('should be Category get use token', (done) => {
        var cate1 = new Category({
            "name": "ผลิตภัณฑ์เพื่อความงาม",
            "cover_image": [
                "https://pub.thisshop.com/shop/block/20191212/17774641_1576135900473.png"
            ]
        });
        cate1.save((err, data) => {
            // console.log(data)
            var subcate = new Category({
                "parent_id": data._id,
                "name": "ผิวกาย (Body & Personal care)",
                "image": "https://pub.thisshop.com/shop/default/20190924/1001293_1569312398552.jpg"
            });
            subcate.save((errsub, datasub) => {
                // console.log(datasub)
                request(app)
                    .get('/api/categories')
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {

                            return done(err);
                        }

                        var resp = res.body;
                        assert.equal(resp.data.length, 1);
                        assert.equal(resp.data[0].items.length, 1);
                        assert.equal(resp.data[0].items[0].name, 'ผิวกาย (Body & Personal care)');
                        done();
                    });
            });
        });


    });

    it('should be Category get on Home', function (done) {

        var cate1 = new Category({
            name: 'ห้องนอน'
        });

        var cate2 = new Category({
            name: 'ห้องครัว'
        });

        cate1.save(function (err, cateData1) {
            cate2.save(function (err, cateData2) {

                var product1 = new Product({
                    "sku": 'sku',
                    "name": 'Product test 1',
                    "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
                    "categorys": [cate1._id, cate2._id]
                });

                var product2 = new Product({
                    "sku": 'sku',
                    "name": 'Product test 2',
                    "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
                    "categorys": [cate1._id, cate2._id]
                });

                var product3 = new Product({
                    "sku": 'sku',
                    "name": 'Product test 3',
                    "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
                    "categorys": [cate1._id]
                });

                var product4 = new Product({
                    "sku": 'sku',
                    "name": 'Product test 4',
                    "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
                    "categorys": [cate1._id]
                });

                var product5 = new Product({
                    "sku": 'sku',
                    "name": 'Product test 5',
                    "images": ["https://res.cloudinary.com/hml20oe33/image/upload/v1576751856/catalog/2_pfwgiy.jpg"],
                    "categorys": [cate1._id, cate2._id]
                });

                product1.save(function (err, data1) {
                    product2.save(function (err, data2) {
                        product3.save(function (err, data3) {
                            product4.save(function (err, data4) {
                                product5.save(function (err, data5) {

                                    request(app)
                                        .get('/api/cateproducthome')
                                        .set('Authorization', 'Bearer ' + token)
                                        .expect(200)
                                        .end(function (err, res) {
                                            if (err) {
                                                return done(err);
                                            }
                                            var resp = res.body;
                                            assert.equal(resp.data.length, 2);
                                            assert.equal(resp.data[0].products.length, 4);
                                            assert.equal(resp.data[1].products.length, 3);
                                            done();
                                        });

                                });
                            });
                        });
                    });
                });
            });
        });

    });

    it('should be Category get by id', function (done) {

        request(app)
            .post('/api/categories')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/categories/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, mockup.name);
                        assert.equal(resp.data.parent_id, 'root');
                        assert.equal(resp.data.image, 'https://res.cloudinary.com/dxpoicnkq/image/upload/v1576564450/image_ukbpnl.svg');
                        assert.equal(resp.data.is_active, true);
                        assert.equal(resp.data.position, 0);
                        assert.equal(resp.data.level, 0);
                        done();
                    });
            });

    });

    it('should be Category post use token', (done) => {
        request(app)
            .post('/api/categories')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.name, mockup.name);
                assert.equal(resp.data.parent_id, 'root');
                assert.equal(resp.data.image, 'https://res.cloudinary.com/dxpoicnkq/image/upload/v1576564450/image_ukbpnl.svg');
                assert.equal(resp.data.is_active, true);
                assert.equal(resp.data.position, 0);
                assert.equal(resp.data.level, 0);
                done();
            });
    });

    it('should be category put use token', function (done) {

        request(app)
            .post('/api/categories')
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
                    .put('/api/categories/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.name, update.name);
                        assert.equal(resp.data.parent_id, 'root');
                        assert.equal(resp.data.image, 'https://res.cloudinary.com/dxpoicnkq/image/upload/v1576564450/image_ukbpnl.svg');
                        assert.equal(resp.data.is_active, true);
                        assert.equal(resp.data.position, 0);
                        assert.equal(resp.data.level, 0);
                        done();
                    });
            });

    });

    it('should be category delete use token', function (done) {

        request(app)
            .post('/api/categories')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/categories/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be category post not use token', function (done) {

        request(app)
            .post('/api/categories')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be category put not use token', function (done) {

        request(app)
            .post('/api/categories')
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
                    .put('/api/categories/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be category delete not use token', function (done) {

        request(app)
            .post('/api/categories')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/categories/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Category.remove().exec(done);
    });

});