'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Product = mongoose.model('Product'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
        Product.find({}, {}, query, function (err, datas) {
            if (err) {
                return res.status(400).send({
                    status: 400,
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp({
                    status: 200,
                    data: datas
                });
            };
        });
};

exports.create = function (req, res) {
    req.body.sale_price_text = req.body.sale_price.currency + req.body.sale_price.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    req.body.regular_price_text = req.body.regular_price.currency + req.body.regular_price.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    req.body.installment_price_text = req.body.installment.currency + req.body.installment.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    req.body.down_payment_text = req.body.down_payment.currency + req.body.down_payment.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    var newProduct = new Product (req.body);
    newProduct.createby = req.user;
    newProduct.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Product.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updProduct = _.extend(req.data, req.body);
    updProduct.updated = new Date();
    updProduct.updateby = req.user;
    updProduct.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};
