angular.module('placesApp', ['auth', 'translate', 'ui.router', 'restangular'])

	.config(['config', 'authProvider', '$stateProvider', '$urlRouterProvider', 
		function(config, authProvider, $stateProvider, $urlRouterProvider) {

		// auth
		authProvider.apiUri = '/' + config.path + 'auth/';

		// routing
		$urlRouterProvider.otherwise('/search');
		$stateProvider
			.state('auth', {
				url: '/login',
				templateUrl: 'views/auth/auth.html'
			})
		    .state('search', {
		    	url: '/search',
		        templateUrl: 'views/search/search.html',
		        controller: 'searchCtrl' 
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
	}]);