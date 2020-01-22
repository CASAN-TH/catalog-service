"use strict";
// use model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  type_id: {
    type: String,
    enum: ["simple", "variable", "grouped", "variation", "virtual"],
    default: "simple"
  },
  shop: {
    type: {
      shop_id: {
        type: String
      },
      shop_name: {
        type: String
      },
      shop_image: {
        type: String
      }
    }
  },
  sku: {
    type: String,
    required: "Please fill a Product SKU"
  },
  name: {
    type: String,
    required: "Please fill a Product name"
  },
  images: [String],
  options: {
    type: [
      {
        name: {
          type: String
        },
        option_lists: {
          type: [
            {
              lists_name: {
                type: String
              },
              lists_price: {
                type: Number
              }
            }
          ]
        }
      }
    ]
  },
  sale_price_percentage: Number,
  sale_avaliable: {
    type: Boolean
  },
  sale_price: {
    type: {
      price: {
        type: Number
      },
      currency: {
        type: String
      }
    }
  },
  sale_price_text: {
    type: String
  },
  regular_price: {
    type: {
      price: {
        type: Number
      },
      currency: {
        type: String
      }
    }
  },
  regular_price_text: {
    type: String
  },
  down_payment: {
    type: {
      price: {
        type: Number
      },
      currency: {
        type: String
      }
    }
  },
  down_payment_text: {
    type: String
  },
  installment: {
    type: {
      price: {
        type: Number
      },
      period: {
        type: Number
      },
      currency: {
        type: String
      }
    }
  },
  installment_price_text: {
    type: String
  },
  down_payment_lists: {
    type: [Number]
  },
  periods_lists: {
    type: [Number]
  },
  shippings: {
    type: [
      {
        shipping_name: {
          type: String
        },
        shipping_fee: {
          type: Number
        },
        shipping_currency: {
          type: String
        }
      }
    ]
  },
  status: {
    type: String,
    enum: ["published", "draft", "private"],
    default: "published"
  },
  featured: {
    type: Boolean,
    default: true
  },
  catalog_visibility: {
    type: String,
    enum: ["visible", "catalog", "search", "hidden"],
    default: "visible"
  },
  short_description: String,
  description: String,
  description_images: [String],
  date_on_sale_from: String,
  date_on_sale_to: String,
  tax_status: {
    type: String,
    enum: ["taxable", "shipping", "none"],
    default: "taxable"
  },
  tax_class: {
    type: String,
    default: "standard"
  },
  stock_status: {
    type: Boolean,
    default: true
  },
  stock_quantity: Number,
  backorders: {
    type: String,
    enum: ["1", "0", "notify"],
    default: "1"
  },
  sold_individually: {
    type: Boolean,
    default: true
  },
  weight: Number,
  length: Number,
  width: Number,
  height: Number,
  reviews_allowed: {
    type: Boolean,
    default: true
  },
  purchase_note: String,
  categorys: [String],
  shipping_class: String,
  attributes: [
    {
      name: String,
      value: String,
      default_value: String,
      visible: Boolean,
      global: Boolean
    }
  ],
  downloads: [
    {
      name: String,
      url: String,
      limit: Number,
      expires_days: Number
    }
  ],
  parent_id: String,
  menu_order: Number,
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

mongoose.model("Product", ProductSchema);
