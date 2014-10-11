angular.module('placesApp')
    .controller('loginCtrl', function($scope, config, auth) {
		$scope.email = config.email;
		$scope.password = config.password;
		$scope.error;
		$scope.login = function() {
			auth
				.login($scope.email, $scope.password)
				.then(
					function complete() { history.back(); },
					function error(err) { $scope.error = err; }
				);
		}; 
	})

    .controller('registerCtrl', function($scope, $location, $http, config, auth) {
    	var confirmationKey = $location.search().confirm;
    	if (confirmationKey)
    		auth
    			.confirm(confirmationKey)
    			.then(function complete() { location.assign('#/search'); });

		$scope.email = config.email;
		$scope.password = config.password;
		$scope.error;
		$scope.register = function() {
			auth
				.register($scope.email, $scope.password)
				.then(
					function complete() { alert('Thank you! We\'ve sent you an email to confirm your account.'); },
					function error(err) { $scope.error = err; }
				);
		};
    });