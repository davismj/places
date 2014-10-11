angular.module('placesApp')
    .controller('editCtrl', function($scope, config, auth, Restangular) {

    	if (!auth.can('add location'))
    		history.back();

    	// configure restangular
    	var Locations = Restangular.all(config.path + 'location');

    	// configure leaflet
    	var	map = new L.map('edit-map', {
    			layers: [
		    		new L.TileLayer(
		    			config.layer, 
		    			config.layerOptions
	    			),
	    			marker = new L.marker([0,0], { draggable: true })
	    		]
			});
			
		marker.on('move', updateLocation);
		map.on('locationfound', moveMarker);
		map.on('click', moveMarker);
		map.locate({
			setView: true,
			maximumAge: 15000,
			enableHighAccuracy: true
		});

    	// set the scope
		$scope.location = { 
			lat: null, 
			lon: null,
			name: '' 
		};
		$scope.submit = function() {
			Locations
				.post($scope.location)
				.then(
					function success() {
						location.assign('#/search');
					},
					function error(err) {
						if (err.status == 403)
							auth.logout()
								.then(function() {
									location.assign('#/login');
								});
					}
				);
		};
		$scope.cancel = function() {
			location.assign('#/search');
		};

		function moveMarker(e) {
			marker.setLatLng([e.latlng.lat, e.latlng.lng]);
		}

		function updateLocation(e) {
			$scope.location.lat = e.latlng.lat;
			$scope.location.lon = e.latlng.lng; 
			$scope.$apply(); 
		}
    });