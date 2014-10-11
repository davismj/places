angular.module('auth')
	.directive('authLogin', function(auth) {
		return {
			restrict: 'E',
			templateUrl: 'components/auth/loginButton/loginButton.html',
			controller: function($scope) {
				$scope.auth = auth;
			}
		};
	});