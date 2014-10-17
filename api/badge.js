var mongo = require('./mongo'),
	Events = require('./event.js');

var BADGES = {};

BADGES['busy'] = {
	id: 0,
	name: 'Busy',
	description: 'At least 20 visits.'
};
Events.subscribe('insert visit', function(visit) {
	mongo.use('visits', function(visits) {
		console.log('in the busy callback where visit is ' + visit)
		visits.count({ user: visit.user }, function(err, count) {
			console.log('where count is ' + count);
			if (count > 20) {
				mongo.use('users', function(users) {
					users.update(
						{ _id: visit.user },
						{ $addToSet: { badges: BADGES['busy'] } }, 
						{ upsert: true },
						function complete() {
							console.log('i did it bro');
						}
					)
				});
			}
		});
	});
});

BADGES['tester'] = {
 	id: 1,
 	name: 'Tester',
	description: 'Contributed at least 5 visits to the first 200.'
};
Events.subscribe('insert visit', function condition(visit) {
	mongo.use('visits', function(visits) {
		visits.count(function(err, count) {
			if (count > 200) {
				mongo.use('users', function(users) {
					users.update(
						{ visits: { $gt: 5 } },
						{ $addToSet: { badges: BADGES['tester'] } },
						{ upsert: true },
						function complete() {}
					);
				});
			}
		});
	});
});