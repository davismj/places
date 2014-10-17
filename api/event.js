var subscriptions = {};

// function Subscription(events, callbacks) { 
// 	this.events = events;
// 	this.callback = callback;
// }

function notify(events, data) {
	var callbacks = subscriptions[events] || [];
	callbacks.forEach(function(cb) {
		cb(data);
	});
}

function subscribe(events, callback) {
	subscriptions[events] = subscriptions[events] || [];
	subscriptions[events].push(callback);
	// return new Subscription(events, callback)
}

// function unsubscribe(events, callback) {
// 	subscriptions[events] = subscriptions[events] || [];
// 	var index = subscriptions[events].indexOf(callback);
// 	if (index >= 0)
// 		subcriptions[events].splice(index, 1);	
// }

module.exports = {
	notify: notify,
	subscribe: subscribe
};