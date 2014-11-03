angular.module('notify', [])
	.service('notify', function NotifyService() {

		var queue = [],
			timeout = 1000;

		this.queue = function(message) {
			if (!queue.length)
				showMessage(message);
			queue.push(message);
		};

		// creates the message, and adds an event listener
		function showMessage(message) {
			var notification = document.getElementById('notification');
			notification.innerText = message;
			// notification.addEventListener('animationend', clearMessage, false);
			notification.classList.add('display');
			setTimeout(clearMessage, 3000);
		}

		// cleans the message 
		function clearMessage() {
			var notification = document.getElementById('notification');
			notification.classList.remove('display');
			notification.innerText = '';
			// notification.removeEventListener('animationend', clearMessage, false);
			setTimeout(function() {
				queue.shift();
				if (queue.length > 0)
					showMessage(queue[0]);
			}, timeout);
		}
	});