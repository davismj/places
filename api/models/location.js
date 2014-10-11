var Point = require('../geojson').Point,
	mongo = require('../mongo');


// create the location object
function Location(json) {
	json = json || {};
	this.name = json.name;
	this.loc = new Point(
		json.lon || 0, 
		json.lat || 0);
}

Location.prototype.computeRating = function() {

}

// ensure an index on the location collection
mongo.use('locations', function(locations) {
	locations.ensureIndex(
		{ loc: '2dsphere' }, 
		function() {}
	);
});

module.exports = Location;