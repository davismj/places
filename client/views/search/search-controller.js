angular.module('placesApp')
    .controller('searchCtrl', function($scope, config, auth, search) {

    	$scope.search = search;

    	Object.defineProperty($scope, 'canAddLocation', {
			get: function() { return auth.can('add location') }
		});

    	// initialize leaflet
    	var	locate = L.Control.extend({
			    options: {
			        position: 'bottomleft'
			    },

			    onAdd: function (map) {
			    	var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
			        container.innerHTML = '<a class="fa fa-crosshairs text-lg" href="#" title="Geolocate"></a>';
			        container.childNodes[0].addEventListener('click', function() {
						map.locate({
							setView: true,
							maximumAge: 15000,
							locationTimeout: 30000,
							enableHighAccuracy: true
						});
			        });
			        return container;
			    }
			}),
			map = new L.map('search-map', {
				layers: [
		    		new L.TileLayer(
		    			config.layer, 
		    			config.layerOptions
	    			)
	    		]
			}), 
			markers = {};

		map.addControl(new locate());

		map.on('locationfound', function (loc) {
			search.query.lat = loc.latitude;
			search.query.lon = loc.longitude;
			search.search();
		});
		map.on('moveend', function() { 
			var bounds = map.getBounds(),
				center = bounds.getCenter(),
				north = [bounds.getNorth(), center.lng],
				zoom = map.getZoom();
			search.query.dist = center.distanceTo(north);
			search.mapView.zoom = zoom;
			search.query.lat = center.lat;
			search.query.lon = center.lng;
			search.mapView.center = center;
			search.search(); 
		});

		if (!search.query.lat || !search.query.lon)
			map.locate({
				setView: true,
				maximumAge: 0,
				locationTimeout: 10000,
				enableHighAccuracy: true
			});
		else
			map.setView(
				search.mapView.center,
				search.mapView.zoom
			);

		$scope.$watch('search.results', function (results) {
			var oldKeys = _.difference(
				_.keys(markers), 
				_.pluck(search.results, '_id')
			);
			oldKeys.forEach(function(key) {
				map.removeLayer(markers[key]);
				delete markers[key];
			});
			results.forEach(function(result) {
				if (!(result._id in markers)) {
					markers[result._id] = new L.Marker([
						result.loc.coordinates[1],
						result.loc.coordinates[0]
					]);
					markers[result._id].addTo(map);
				}
			});
		});
	});