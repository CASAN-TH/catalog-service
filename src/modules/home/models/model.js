'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var HomeSchema = new Schema({
    slides: {
        type: [
            {
                background_color: {
                    type: String
                },
                image: {
                    type: String
                }
            }
        ]
    },
    menus: {
        type: [
            {
                icon_menu: {
                    type: String
                },
                name_menu: {
                    type: String
                }
            }
        ]
    },
    blocks: {
        type: [
            {
                name: {
                    type: String
                },
                background_img: {
                    type: String
                },
                products: {
                    type: [
                        {
                            name: {
                                type: String
                            },
                            image: {
                                type: String
                            },
                            discount: {
                                type: String
                            },
                            price: {
                                type: {
                                    amount: {
                                        type: String
                                    },
                                    currency: {
                                        type: String
                                    }
                                }
                            },
                            installment: {
                                type: {
                                    amount: {
                                        type: String
                                    },
                                    period: {
                                        type: String
                                    },
                                    currency: {
                                        type: String
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
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

mongoose.model("Home", HomeSchema);