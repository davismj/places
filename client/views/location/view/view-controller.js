angular.module('placesApp')
	.controller('viewCtrl', function ($scope, $stateParams, $http, config, auth, Restangular) {

		var locationUrl = '/{path}location/{id}'
				.replace('{path}', config.path)
				.replace('{id}', $stateParams.id);
		
		var Location = Restangular.one(config.path + 'location', $stateParams.id);

		$scope.location = Location.get().$object;
		$scope.location.reviews = [];
		Location
			.getList('visit')
			.then(function(reviews) {

				// if logged in
				if (auth.id) {

					// remove this user's review if present and attach it to the user and the page
					var visit = _.remove(reviews, function(visit) {
						return visit.user == auth.id
							&& (new Date() - new Date(visit.timestamp)) < 3600000;
					})[0];
					if (visit) {
						$scope.visit.rating = visit.rating;
						$scope.visit.body = visit.body;
						$scope.checkedin = true;
						$scope.editingReview = true;
						auth.visits[$stateParams.id] = visit;
					}
				}

				$scope.location.reviews = reviews;
			});

		$scope.auth = auth;

		$scope.key = config.mapKey;
		$scope.mapWidth = document.getElementById('view-map').width;

		// visit 
		$scope.visit = auth.visits[$stateParams.id];
		$scope.checkedin = !!$scope.visit;
		$scope.editingReview = true; // !$scope.visit || !$scope.visit.body;
		$scope.visit = $scope.visit || {
			body: null,
			rating: null
		};

		$scope.rate = function(rating) {
			if ($scope.editingReview)
				$scope.visit.rating = rating;
		};

		$scope.registerVisit = function() {
			$http.post(
				locationUrl + '/visit', 
				JSON.stringify($scope.visit)
			);

			auth.visits[$stateParams.id] = $scope.visit;

			$scope.checkedin = true;
			$scope.editingReview = !($scope.visit.rating || $scope.visit.body);
		};
	});