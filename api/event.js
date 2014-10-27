var _ = require('lodash');
var subscriptions = {};

function notify(event, args) {
	args = _.flatten([args], true);
	var callbacks = subscriptions[event] || [];
	callbacks.forEach(function(cb) {
		cb.apply(this, args);
	});
}

function subscribe(event, callback) {
	subscriptions[event] = subscriptions[event] || [];
	subscriptions[event].push(callback);
}

module.exports = {
	notify: notify,
	subscribe: subscribe
};

//EVENT_RE = /'[a-z]+:[a-z]+(\?[a-z]+=[a-z]+)?/i;