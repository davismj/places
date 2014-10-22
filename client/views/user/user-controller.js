angular.module('placesApp')
    .controller('userCtrl', function($scope, config, auth, Restangular) {

		var User = Restangular.one(config.path + 'user', auth.id);

		$scope.user = User.get().$object;
    	$scope.titles = [];
		$scope.badges = User.getList('badge').$object;

		var uploadControl = document.getElementById('avatar-upload'),
			imageType = /image\/[png|jpeg|jpg|gif|webp]/;
		uploadControl.addEventListener('change', function (event) {
			var image = event.target.files[0];
			if (!imageType.test(image.type))
				return alert('Only image files are accepted.');
			// do something
		});

		$scope.selectImage = function() {
			uploadControl.click();
		};

		$scope.updateUser = function() {
			$scope.user.post();
		};
    });