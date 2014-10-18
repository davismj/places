angular.module('placesApp', ['auth', 'search', 'translate', 'ui.router', 
	'restangular'])

	.config(['config', 'authProvider', 'searchProvider', '$stateProvider', 
		'$urlRouterProvider', 
		function(config, authProvider, searchProvider, $stateProvider, 
			$urlRouterProvider) {

		// auth
		authProvider.apiUri = '/' + config.path + 'auth/';
		searchProvider.apiUri = config.path + 'location'

		// routing
		$urlRouterProvider.otherwise('/');
		$stateProvider
		    .state('search', {
		    	url: '/',
		        templateUrl: 'views/search/search.html',
		        controller: 'searchCtrl' 
		    })
			.state('auth', {
				url: '/login',
				templateUrl: 'views/auth/auth.html'
			})
		    .state('edit', {
		    	url: '/place/:id/edit',
		        templateUrl: 'views/location/edit/edit.html',
		        controller: 'editCtrl' 
		    })
		    .state('view', {
		    	url: '/place/:id/view',
		        templateUrl: 'views/location/view/view.html',
		        controller: 'viewCtrl' 
		    });
	}])

	.run(['auth', function($auth) {
		return $auth.verify(); 
	}])

	.controller('mainCtrl', function($scope, search) {
		$scope.search = search;
	});