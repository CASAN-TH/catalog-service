"use strict";
// use model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  parent_id: {
    type: String,
    required: "Please fill a Category Parent",
    default: "root"
  },
  name: {
    type: String,
    required: "Please fill a Category name"
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dxpoicnkq/image/upload/v1576564450/image_ukbpnl.svg"
  },
  cover_image: {
    type: [
      {
        image: {
          type: String
        },
        type_promotion: {
          type: String,
          enum: ['page', 'web']
        },
        link_promotion: {
          type: String
        }
      }
    ]
  },
  is_active: {
    type: Boolean,
    default: true
  },
  position: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  },
  products: {
    type: []
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  createby: {
    _id: {
      type: String
    },
    username: {
      type: String
    },
    displayname: {
      type: String
    }
  },
  updateby: {
    _id: {
      type: String
    },
    username: {
      type: String
    },
    displayname: {
      type: String
    }
  }
});

mongoose.model("Category", CategorySchema);
