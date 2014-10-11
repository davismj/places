angular.module('translate')
	.directive('translateLanguage', function() {
		return {
			restrict: 'E', 
			templateUrl: 'components/translate/languageSelect/languageSelect.html',
			controller: function($scope, $translate) {
				$scope.language = 'en';
				$scope.updateLanguage = function() {
					$translate.use($scope.language);
				}; } }; });