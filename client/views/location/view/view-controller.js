angular.module('placesApp')
	.controller('viewCtrl', function ($scope, $stateParams, $http, config, auth, Restangular) {

		var locationUrl = '/{path}location/{id}'
				.replace('{path}', config.path)
				.replace('{id}', $stateParams.id);
		
		var Location = Restangular.one(config.path + 'location', $stateParams.id);

		$scope.location = Location.get().$object;
		$scope.location.reviews = Location.getList('visit').$object;

		$scope.auth = auth;

		$scope.key = config.mapKey;
		$scope.mapWidth = document.getElementById('view-map').width;

		// checkins
		$scope.checkedin = false;

		// review
		$scope.review = {
			rating: null,
			body: null,
			editing: true
		};

		$scope.rate = function(rating) {
			$scope.review.rating = rating;
		};

		$scope.visit = function() {
			$http.post(
				locationUrl + '/visit', 
				JSON.stringify($scope.review)
			);
			$scope.checkedin = true;
			$scope.review.editing = false;
		}
	});