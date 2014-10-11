var express = require('express'),
	router = express.Router(),
	extend = require('extend'),
	mongo = require('./mongo'),
	auth = require('./auth'),
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
	auth.verify(req, res, { can: 'add location'}, function(user) {
		mongo.use('locations', function(locations) {
			locations.insert(
				new Location(req.body), 
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
				extend(responseObj, loc);
				if (++responseCount == totalRequests)
					res.json(responseObj);
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
				function complete() {
					mongo.use('locations', function(locations) {

					});
				}
			)
		});
	});
	res.send(200);
});

function isValidId(val) {
	return /^[0-9a-f]{24}$/.exec(val);
}

exports.routes = router;