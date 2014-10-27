var _ = require('lodash'),
	mongo = require('./mongo'),
	Event = require('./event');

var BADGE = {},
	REPUTATION = {
		visit: 10,
		rating: 10,
		review: 20
	};

// TODO: update badges to a { id: progress } structure on users

// TODO: not dry
Event.subscribe('insert:visit', function(visit) {
	var rep = REPUTATION.visit;
	if (visit.rating > 0)
		rep += REPUTATION.rating;
	if (visit.body)
		rep += REPUTATION.review;
	mongo.use('users', function(users) {
		users.update(
			{ _id: visit.user },
			{ $inc: { reputation: rep } },
			{ upsert: true },
			function complete() {}
		);
		Event.notify('change:reputation?user=' + visit.user, rep);
	});
});
Event.subscribe('update:visit', function(newVisit, oldVisit) {
	var rep = 0;
	if (newVisit.rating > 0 && !oldVisit.rating > 0)
		rep += REPUTATION.rating;
	if (newVisit.body && !oldVisit.body)
		rep += REPUTATION.review;
	mongo.use('users', function(users) {
		users.update(
			{ _id: newVisit.user },
			{ $inc: { reputation: rep } },
			{ upsert: true },
			function complete() {}
		);
		Event.notify('change:reputation?user=' + newVisit.user, rep);
	});
});

BADGE['busy'] = {
	id: 0,
	name: 'Busy',
	description: 'At least 20 visits.'
};
Event.subscribe('insert:visit', function(visit) {
	mongo.use('visits', function(visits) {
		visits.count({ user: visit.user }, function(err, count) {
			if (count > 20) {
				mongo.use('users', function(users) {
					users.update(
						{ _id: visit.user },
						{ $addToSet: { badges: BADGE['busy'] } }, 
						{ upsert: true },
						function complete() {}
					)
				});
			}
		});
	});
});

BADGE['tester'] = {
 	id: 1,
 	name: 'Tester',
	description: 'Contributed at least 5 visits to the first 200.'
};
Event.subscribe('insert:visit', function condition(visit) {
	mongo.use('visits', function(visits) {
		visits.count(function(err, count) {
			if (count > 200) {
				mongo.use('users', function(users) {
					users.update(
						{ visits: { $gt: 5 } },
						{ $addToSet: { badges: BADGE['tester'] } },
						{ upsert: true },
						function complete() {}
					);
				});
			}
		});
	});
});

module.exports = _.values(BADGE);