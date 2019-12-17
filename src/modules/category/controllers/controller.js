'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Category = mongoose.model('Category'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res, next) {

    Category.find(function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // res.jsonp({
            //     status: 200,
            //     data: datas
            // });
            req.CategoryData = datas;
            next();
        };
    });
};

exports.resData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.cookingData
    });
}

exports.cookingData = function (req, res, next) {
    var x = req.CategoryData;
    req.cookingData = [];
    req.CategoryData.forEach(itm => {
        if (itm.parent_id === "root") {
            req.cookingData.push({
                _id: itm._id,
                name: itm.name,
                cover_image: itm.cover_image,
                image: itm.image,
                items: _.filter(x, function (chr) {
                    // console.log(chr);
                    return chr.parent_id == itm._id;
                })
            })
        }
    })
    // console.log(JSON.stringify(req.cookingData));
    next();
}

exports.create = function (req, res) {
    var newCategory = new Category(req.body);
    newCategory.createby = req.user;
    newCategory.save(function (err, data) {
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

    Category.findById(id, function (err, data) {
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
    var updCategory = _.extend(req.data, req.body);
    updCategory.updated = new Date();
    updCategory.updateby = req.user;
    updCategory.save(function (err, data) {
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
