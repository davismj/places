angular.module('search', ['restangular'])
	.provider('search', function SearchProvider() {

		var Restangular, $q;

		this.apiUri = 'api/location';
		this.distance = 100;

		this.$get = ['Restangular', '$q', function(restangular, q) {
			Restangular = restangular, $q = q;
			return new Search(this.apiUri, this.distance);
		}];

		function Search(apiUri, dist) {

			Object.defineProperty(this, 'apiUri', {
				value: apiUri,
				enumerable: false
			});

			this.mapView = {
				zoom: null,
				center: null
			};

			this.query = {
				search: '',
				lat: 0,
				lon: 0,
				dist: dist
			};
			this.results = [];
		}
			
		Search.prototype.search = function() {
			var search = this;
			Restangular.all(search.apiUri)
				.getList(this.query)
				.then(function(locations) {
					search.results = locations;
				});
		};

		Search.prototype.getBounds = function() {
			var search = this,
				minX = maxX = search.query.lon,
				minY = maxY = search.query.lat;
			search.results.forEach(function(result) {
				var coords = result.loc.coordinates;
				minX = Math.min(minX, coords[0]);
				maxX = Math.max(maxX, coords[0]);
				minY = Math.min(minY, coords[1]);
				maxY = Math.max(maxY, coords[1]);
			});
			return [[minY, minX], [maxY, maxX]];
		};
	});