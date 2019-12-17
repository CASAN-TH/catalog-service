'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Category = mongoose.model('Category');

var credentials,
    token,
    mockup;

describe('Category CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            name: 'name'
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
                        assert.equal(resp.data.length,1);
                        assert.equal(resp.data[0].items.length,1);
                        assert.equal(resp.data[0].items[0].name,'ผิวกาย (Body & Personal care)');
                        done();
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