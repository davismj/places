	angular.module('placesApp', ['auth', 'search', 'translate', 'progress', 
		'ui.router', 'restangular'])

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
			.state('user', {
				url: '/user',
				templateUrl: 'views/user/user.html',
				controller: 'userCtrl',
				resolve: {
					verify: function(auth) {
						return auth.verify();
					}
				}
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

	.run(function($rootScope, auth) {
	    $rootScope.$on(
			'$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams) { 
		    	// event.preventDefault(); // to prevent navigation
			}
		);
	})

	.controller('mainCtrl', function($scope, search, auth) {
		$scope.search = search;
		$scope.auth = auth;
	});