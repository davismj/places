angular.module('placesApp')

	.constant('config', {
		path: 'places/api/',
		email: 'davis.matthewjames@gmail.com',
		password: 'password',
		layer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		layerOptions: { 
			attribution: 'Map data © <a href="http://openstreetmap.org">\
				OpenStreetMap</a> contributors' 
		},
		mapKey: 'Kmjtd%7Cluu7n162n1%2C22%3Do5-h61wh'
	});