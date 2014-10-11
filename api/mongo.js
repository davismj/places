var mongodb = require('mongodb'),
	mongo = null,
	callbacks = [];

mongodb.connect(require('./config').mongo, function(err, db) {
	if (err) 
  		return console.log(err);
  	mongo = db;
  	while (args = callbacks.pop())
  		args[1](mongo.collection(args[0])); 
});

exports.use = function use(collection, callback) {
	if (mongo)
		callback(mongo.collection(collection));
	else
		callbacks.push(arguments);
};

exports.ObjectId = mongodb.ObjectID;