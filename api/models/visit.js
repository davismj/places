var mongo = require('../mongo');

// create the location object
function Visit(json) {

	this.user = json.user;
	this.location = json.location;
	this.rating = json.rating;
	if (json.body)
		this.body = json.body.trim() || null;
	this.timestamp = new Date();
}

Visit.fields = {
	rating: 1,
	body: 1,
	timestamp: 1
};

// ensure an index on the location collection
mongo.use('visits', function(visits) {
	visits.ensureIndex(
		{ user: 1, location: 1 }, 
		// { unique: true },
		function() {}
	);
	visits.ensureIndex(
		{ user: 1 },
		function() {}
	);
});

module.exports = Visit;