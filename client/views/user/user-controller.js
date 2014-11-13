angular.module('placesApp')
    .controller('userCtrl', function($scope, config, auth, Restangular) {

		var User = Restangular.one(config.path + 'user', auth.id);

		$scope.user = User.get().then(function(user) { $scope.user = user; });
    	$scope.titles = [];
		$scope.badges = User.getList('badge').$object;
		$scope.avatar = {
			background: "url('img/user/{id}.png?') center/contain no-repeat"
				.replace('{id}', auth.id)
		}

		var uploadControl = document.getElementById('avatar-upload'),
			imageType = /image\/[png|jpeg|jpg|gif|webp]/;
		uploadControl.addEventListener('change', function (event) {
			
			var image = event.target.files[0];
			if (!imageType.test(image.type))
				return alert('Only image files are accepted.');
			
			var data = new FormData();
            data.append('files', image);

            // upload it
           	User
           		.withHttpConfig({ transformRequest: angular.identity })
			    .customPOST(data, 'image', undefined, {'Content-Type': undefined})
			    .then(function success() {
		      		$scope.avatar.background = 
		      			$scope.avatar.background.replace('?', '?a')
			    });
		});

		$scope.selectImage = function() {
			uploadControl.click();
		};

		$scope.updateUser = function() {
			$scope.user.post();
		};

		$scope.logout = function() {
			auth.logout()
				.then(function() {
					location.assign('#/');
				});
		};
    });