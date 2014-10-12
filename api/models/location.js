var Point = require('../geojson').Point,
	mongo = require('../mongo');


// create the location object
function Location(json) {
	json = json || {};
	this.name = json.name;
	this.loc = new Point(json.lon, json.lat);
}

Location.prototype.valid = function() {
	return !!(
		this.name
		&& this.loc && this.loc.valid()
	);
}

// ensure an index on the location collection
mongo.use('locations', function(locations) {
	locations.ensureIndex(
		{ loc: '2dsphere' }, 
		function() {}
	);
});

module.exports = Location;