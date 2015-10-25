'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var port = 3000;

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    restaurant: String,
    fakeId: String,
    contacts: [{
        name: String,
        creditCard: {
            number: String,
            expireDate: String,
            cvv: String
        },
        orderItems: [
            {
                name: String,
                quantity: Number,
                price: Number
            }
        ],
        tip: Number
    }],
    lockedDateTime: Date,
    pickupDateTime: Date,
    state: String
});

var Order = mongoose.model('Order', OrderSchema);

// set up connection to mongoDB
mongoose.connect(
	'mongodb://localhost/gophr',
	{
		server: {
			socketOptions: {
				connectTimeoeutMS: 10000,
				keepAlive: 1
			}
		}
	}
);

mongoose.connection.once('open', function() {
	console.info(
		'Connected to MongoDB'
	);
});

mongoose.connection.on('error', function(err) {
	console.error(
		'Error happened in connection to MongoDB',
		{
			error: err
		}
	);
});

// parse json as body
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/restaurant/menu', function(req, res) {
    var menu = [
    	{
    		category: "Sandwiches",
    		name: "Bacon Panini",
    		price: 10.95
    	},
    	{
    		category: "Sandwiches",
    		name: "Roast Beef",
    		price: 10.05
    	},
    	{
    		category: "Sandwiches",
    		name: "Classic Reuben",
    		price: 10.95
    	},
    	{
    		category: "Entrée",
    		name: "Dry-Aged Steak",
    		price: 20.99
    	},
    	{
    		category: "Entrée",
    		name: "Meatballs and Pasta",
    		price: 7.95
    	},
    	{
    		category: "Entrée",
    		name: "Lobster Tail",
    		price: 30.99
    	},

    	{
    		category: "Cocktails",
    		name: "Bloody Mary",
    		price: 10.95
    	},

    	{
    		category: "Cocktails",
    		name: "Vodka Redbull",
    		price: 10.95
    	},
    	{
    		category: "Cocktails",
    		name: "Rum and Coke",
    		price: 9.98
    	},
    	{
    		category: "Cocktails",
    		name: "Gin and Tonic",
    		price: 10.95
    	}

    ];

    res.json(menu);
});

app.get('/api/orders', function(req, res) {
    Order.find({}, function(err, orders) {
        if (err) {
            res.status(503).end();
            return;
        }

        res.json(orders);
    });
});
app.get('/api/order/:orderId', function(req, res) {
    Order.findOne({_id: req.params.orderId}, function(err, order) {
        if (err) {
            res.status(503).end();
            return;
        }

        if (!order) {
            res.status(404).end();
            return;
        }

        res.json(order);
    });
});
// use fakeId because we will need
app.get('/api/order/:fakeId/shoppinglist', function(req, res) {
    Order.findOne({fakeId: req.params.fakeId}, function(err, order) {
        if (err) {
            res.status(503).end();
            return;
        }

        if (!order) {
            res.status(404).end();
            return;
        }

        // process order to generate combined shopping list
        var result = {};

        result.tip = order.contacts.reduce(function(result, contact) {
            return (contact.tip) ? result + contact.tip : result;
        }, 0);
        result.list = order.contacts.reduce(function(result, contact) {
            return contact.orderItems.reduce(function(orderItemResult, orderItem) {
                var itemIndex = -1;

                orderItemResult.forEach(function(item, index) {
                    if (item.name === orderItem.name) {
                        itemIndex = index;
                    }
                });

                if (itemIndex > -1) {
                    orderItemResult[itemIndex].quantity += orderItem.quantity;
                } else {
                    orderItemResult.push(orderItem);
                }

                return orderItemResult;
            }, result);
        }, []);

        res.json(result);
    });
});
app.post('/api/order/:orderId/checkout', function(req, res) {
    Order.findOne({_id: req.params.orderId}, function(err, order){
        if (err) {
            res.status(503).end();
            return;
        }

        if (!order) {
            res.status(404).end();
            return;
        }

        var contactIndex = -1;

        order.contacts.forEach(function(contact, index) {
            if (contact._id == req.body._id) {
                contactIndex = index;
            }
        });

        order.contacts[contactIndex].orderItems = req.body.orderItems;
        order.contacts[contactIndex].tip = req.body.tip;

        order.save(function(err) {
            if (err) {
                res.status(503).end();
                return;
            }

            res.status(200).end();
        })
    });
});
app.post('/api/order', function(req, res) {
    var order = new Order(req.body);

    order.state = 'pending';
    order.fakeId = LeftPadWithZeros(Math.floor(Math.random() * 10000000000), 10);

    order.save(function(err) {
        if (err) {
            res.status(503).end();
            return;
        }

        res.status(200).end();
    });
});

function LeftPadWithZeros(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
}

app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
