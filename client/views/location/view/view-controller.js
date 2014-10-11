angular.module('placesApp')
	.controller('viewCtrl', function ($scope, $stateParams, $http, config, auth, Restangular) {

		var locationUrl = '/{path}location/{id}'
				.replace('{path}', config.path)
				.replace('{id}', $stateParams.id);
			
		$scope.location = 
			Restangular
				.one(config.path + 'location', $stateParams.id)
				.get().$object;

		$scope.auth = auth;

		$scope.key = config.mapKey;
		$scope.mapWidth = document.getElementById('view-map').width;

		// checkins
		$scope.checkedin = false;
		$scope.checkin = function() {
			$http.post(locationUrl + '/checkin');
			$scope.checkedin = true;
		};

		// review
		$scope.review = {
			rating: null,
			body: null
		};

		$scope.rate = function(rating) {
			if (rating == $scope.review.rating) 
				return;
			$scope.review.rating = rating;
			$scope.leaveReview();
		};

		$scope.leaveReview = function() {
			$http.post(
				locationUrl + '/rate', 
				JSON.stringify($scope.review)
			);
		}
	});
	// .directive('checkinButton', function () {
	// 	return {
	// 		templateUrl: 'views/location/view/checkinButton.html',
	// 		controller: function($scope, $http, $stateParams, config) {
	// 			var checkinUrl = '/{path}/location/{id}/checkin'
	// 				.replace('{path}', config.path)
	// 				.replace('{id}', $stateParams.id);
	// 			$scope.checkedin = false;
	// 			$scope.checkin = function() {
	// 				$http.post(checkinUrl);
	// 				$scope.checkedin = true;
	// 			};
	// 		}
	// 	}
	// })
	// .directive('ratingMeter', function () {
	// 	return {
	// 		templateUrl: 'views/location/view/ratingMeter.html',
	// 		controller: function($scope, $http, $stateParams, config) {
	// 			var rateUrl = '/{path}location/{id}/rate'
	// 				.replace('{path}', config.path)
	// 				.replace('{id}', $stateParams.id);
	// 			$scope.rating = 0;
	// 			$scope.rate = function(rating) {
	// 				if (rating == $scope.rating) 
	// 					return;
	// 				$scope.rating = rating;
	// 				$http.post(rateUrl, rating.toString());
	// 			};
	// 		}
	// 	}
	// });