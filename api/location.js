var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	mongo = require('./mongo'),
	auth = require('./auth'),
	Events = require('./event'),
	Location = require('./models/location'),
	Visit = require('./models/visit');

router.get('/', function(req, res) {
	var query = {};
	if (req.query.lat && req.query.lon && req.query.dist)
		query.loc = {
			$near: {
				$geometry: {
					type: "Point" ,
					coordinates: [ 
						parseFloat(req.query.lon), 
						parseFloat(req.query.lat) ] },
				$maxDistance: parseFloat(req.query.dist),
			}
		};

	if (req.query.search)
		query.name = {
			$regex: '.*' + req.query.search + '.*',
		 	$options: '-i'
		};
		
	mongo.use('locations', function(locations) {
		locations
			.find(query)
			.toArray(function(err, locs) {
				if (err)
					res.send(500, err);
				else 
					res.json(locs);
			});
	});
});

router.post('/', function(req, res) {
	var loc = new Location(req.body);
	if (!loc.valid())
		res.send(400);
	auth.verify(req, res, { can: 'add location'}, function(user) {
		mongo.use('locations', function(locations) {
			locations.insert(
				loc, 
				function(err, doc) {
					res.json(doc);
				}
			);
		});		
	});
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();

	// load the correct location
	mongo.use('locations', function(locations) {
		locations
			.find({ _id: mongo.ObjectId(id) })
			.nextObject(function(err, loc) {
				if (err)
					res.send(500, err);
				else if (!loc)
					res.send(404);
				else
					res.json(loc);
			});
	});
});

router.get('/:id/visit', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();
	mongo.use('visits', function(visits) {
		visits
			.find({ location: id, body: { $exists: true }  }, { limit: 10 })
			.toArray(function(err, visits) {
				if (err)
					res.send(500, err);
				else 
					res.json(visits);
			});
	});
});

router.post('/:id/visit', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();
	auth.verify(req, res, function(user) {
		mongo.use('visits', function(visits) {
			var visit = new Visit(req.body);
			visit.user = user.id;
			visit.location = id;
			visits.update(
				{ location: id, user: user.id, timestamp: { $gt: new Date(Date.now() - (1000*60*60)) } },
				visit,
				{ upsert: true },
				function complete(err, count, status) {
					Events.notify('insert visit', visit); // TODO check if new or existing
					visits.mapReduce(

						// map visits per user
						function map() {
							emit(this.user, this.rating);
						},

						// compute the users aggregate rating
						function reduce(userId, ratings) {
							var sum = _.reduce(ratings, function(sum, val) {
								return sum + val;
							}, 0);
							return sum / ratings.length;
						},{
							out: { inline: 1 },
							query: { location: id, rating: { $exists: true } }
						},
						function(err, userRatings) {
							var sum = _.reduce(userRatings, function(sum, obj) {
								return sum + obj.value;
							}, 0);
							mongo.use('locations', function(locations) {
								locations.update(
									{ _id: mongo.ObjectId(id) },
									{ $set: { rating: sum / userRatings.length } },
									function complete() { }
								);
							});
						} 
					);
					visits.count({ user: user.id }, function(err, count) {
						mongo.use('users', function(users) {
							users.update(
								{ _id: user.id },
								{ $set: { visits: count } },
								{ upsert: true },
								function complete() {}
							);
						});
					});
				}
			)
		});
		res.send(200);
	});
});

function isValidId(val) {
	return /^[0-9a-f]{24}$/.exec(val);
}

exports.routes = router;