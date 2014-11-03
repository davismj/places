var express = require('express'),
	router = express.Router(),
	_ = require('lodash'),
	formidable = require('formidable'),
	mongo = require('./mongo'),
	auth = require('./auth'),
	badges = require('./badge'),
	Event = require('./event'),
	User = require('./models/user');

router.get('/:id', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();

	auth.verify(req, res, function(user) {
		if (!user.id == id)
			res.send(403);
		res.json(user.toJson());
	});
});

router.post('/:id', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();

	auth.verify(req, res, function(user) {
		if (!user.id == id)
			res.send(403);
		user.name = req.body.name;
		user.save();
		res.send(200);
	});
});

router.post('/:id/image', function(req, res) {

	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();

	auth.verify(req, res, function(user) {
		if (!user.id == id)
			res.send(403);

		var form = new formidable.IncomingForm();
		form.uploadDir = '.';
		form.on('fileBegin', function(name, file) { 

			// TODO: not force the ext?
			file.path = '../client/img/user/' + id + '.png'; 
		})
	    form.parse(req)
	    res.send(200);
	});
});

// should return a list of all badges with percentage completion
// maybe the right way to handle 
router.get('/:id/badge', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();
	else
		id = parseInt(id);
	mongo.use('users', function(users) {
		users.findOne(
			{ _id: id },
			['badges'],
			function(err, user) {

				if (!user)
					res.send(404).end();
				
				// get new badges (all badges, for now?)
				if (!user.badges)
					user.badges = [];

				// for each badge that the keys of all badges does not contain that key
				var oldBadges = _.pluck(user.badges, 'id'),
					newBadges = _.filter(badges, function(badge) {
						return !_.contains(oldBadges, badge.id);
					});

				newBadges.forEach(function(badge) {
					badge.progress = 0.5;
				});

				user.badges = user.badges.concat(newBadges);

				users.update(
					{ _id: id },
					{ $set: { badges: user.badges } },
					function complete() {}
				);

				res.json(user.badges);
			}
		);
	});
});

router.get('/:id/score', function(req, res) {
	var id = req.params.id;
	if (!isValidId(id))
		res.send(400).end();
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

  	mongo.use('users', function(users) {
  		users.findOne(
  			{ _id: parseInt(id) },
  			['reputation', 'badges'],
  			function complete(err, user) {
				postEvent(user, 'initialize');
  			}
		);
  	});

  	// TODO: unsubsribe on response disposal
  	Event.subscribe('progress:badge?user=' + id, function(data) {
  		postEvent(data, 'badge');
  	});
  	Event.subscribe('change:reputation?user=' + id, function(data) {
  		postEvent(data, 'reputation');
  	});

  	function postEvent(data, event) {
  		if (!data)
  			return;
  		if (typeof data !== "string")
  			data = JSON.stringify(data);
  		if (event)
  			res.write('event: ' + event + '\n')
  		res.write('data: ' + data + '\n\n');
  	}
});

function isValidId(val) {
	return /^[0-9]+$/.exec(val);
}

exports.routes = router;