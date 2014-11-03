angular.module('progress', [])
	.directive('progressBar', function() {
	    return {
			restrict: 'E',
			link: function($scope, element, attrs) {
				$scope.$watch(attrs.ngProgress, function(val) {
		        	$scope.progress = (val * 100) + '%';
		        	$scope.style = { width: $scope.progress };
			    });
			},
			templateUrl: 'components/progress/progress.html'
	    };
  	}); 