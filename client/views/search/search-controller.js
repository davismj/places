angular.module('placesApp')
    .controller('searchCtrl', function($scope, config, auth, Restangular) {

    	// initialize restangular
    	var Locations = Restangular.all(config.path + 'location');

    	// initialize leaflet
    	var	map = new L.map('search-map', {
			layers: [
	    		new L.TileLayer(
	    			config.layer, 
	    			config.layerOptions
    			)
    		]
		});

		map.on('locationfound', locationFound);
		map.locate({
			setView: true,
			maximumAge: 15000,
			enableHighAccuracy: true
		});
		map.on('moveend', function() { search(); });

    	// scope properties
    	$scope.searchText;
		$scope.position = {
			lat: null,
			lon: null
		};
		$scope.locations = [];
		$scope.search = search;
		Object.defineProperty($scope, 'canAddLocation', {
			get: function() { return auth.can('add location') }
		});

		function search(lat, lon) {
			var mapBounds = map.getBounds(),
				northEast = mapBounds.getNorthEast(),
				southWest = mapBounds.getSouthWest(),
				center = mapBounds.getCenter(),
				dist = northEast.distanceTo(southWest) / 3.5,
				query = {
					lat: lat || center.lat,
					lon: lon || center.lng,
					dist: dist 
				};

			if ($scope.searchText)
				query.search = $scope.searchText;

			$scope.locations.forEach(removeMarker);
			Locations
				.getList(query)
				.then(function(locations) {
					locations.forEach(addMarker);
					$scope.locations = locations; 
				});
		}

		function addMarker(location) {
			location.marker = new L.marker(
				location.loc.coordinates.reverse());
			location.marker.addTo(map);
		}

		function removeMarker(location) {
			if (location.marker)
				map.removeLayer(location.marker);
		}

		function locationFound(loc) {
			$scope.position.lat = loc.latitude;
			$scope.position.lon = loc.longitude;
			search(loc.latitude, loc.longitude);
		}
	});