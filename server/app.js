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
                value: Number
            }
        ]
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
app.get('/api/order/:orderId/checkout', function(req, res) {
    // TODO: to be implemented
    res.status(503).end();
});
app.post('/api/order', function(req, res) {
    var order = new Order(req.body);

    order.state = 'pending';

    order.save(function(err) {
        if (err) {
            res.status(503).end();
            return;
        }

        res.status(200).end();
    });
});

app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);
