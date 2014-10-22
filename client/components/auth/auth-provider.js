angular.module('auth', [])
	.provider('auth', function AuthProvider() {
			
		var $http, $q, verify;

		// AuthProvider attributes
		this.apiUri = 'api/auth';

		this.$get = ['$http', '$q', function(http, q) {
			$http = http, $q = q;
			return new Auth(this.apiUri);
		}];

		// declare persistant user-specific things here
		function Auth(apiUri) {

			var auth = this;
			verify = $q.defer();

			Object.defineProperty(this, 'apiUri', {
				value: apiUri,
				enumerable: false
			});

			Object.defineProperty(this, 'loggedIn', {
				value: false,
				enumerable: false,
				writable: true,
			});

			this.id = null;
			this.email = null;

			var flags = 0;
			Object.defineProperty(this, 'flags', {
				get: function() { return flags; },
				set: function(v) { flags = v || 0; },
				enumerable: true
			});
			
			var visits = {};
			Object.defineProperty(this, 'visits', {
				get: function()  { return visits; },
				set: function(v) { visits = v || {} },
				enumerable: true
			});

			$http
				.get(apiUri + 'verify')
				.success(function(user) {
					if (user)
						auth.setUser(user);
					verify.resolve(auth);
				})
				.error(function() {
					verify.reject(auth);
				});
		}

		angular.extend(Auth, {
			FLAGS: {
				'login': 0,
				'add location': 1
			}
		});

		Auth.prototype.can = function(permission) {
			return this.flags & Auth.FLAGS[permission];
		}

		// /* @function setUser
		//  * Uses the passed data to set the user context for the app.
		//  * @param {object} data Object returned by the verify or login call.
		//  */
		Auth.prototype.setUser = function(data) { 
			this.loggedIn = !!data;
			data = data || {};
			Object.keys(this)
				.forEach(function(key) {
					this[key] = data[key];
				}, this);
		};

		Auth.prototype.verify = function() {
			return verify.promise;
		};

		// /* @method login
		//  * Posts the current email and password to the login endpoint. If
		//  * successful, the result is passed to storeHash_.
		//  * @returns {Promise} A promise for the result of the login call.
		//  */
		Auth.prototype.login = function(email, password) {
			var dfd = $q.defer(),
				auth = this;
			$http
				.post(auth.apiUri + 'login', {
					email: email,
					password: password
				})
				.success(function(response) {
					auth.setUser(response);
					dfd.resolve(response);
				})
				.error(function(response, status) {
					dfd.reject(response, status);
				});
			return dfd.promise;
		};

		// /* @method logout
		//  * Clears the logged in user credentials.
		//  * @returns {Promise} A promise for the result of the logout call.
		//  */
		Auth.prototype.logout = function() {
			var dfd = $q.defer(),
				auth = this;
			$http
				.post(auth.apiUri + 'logout')
				.success(function(response) {
					auth.setUser(null);
					dfd.resolve(response);
				})
				.error(function(response,status) {
					dfd.reject(response, status);
				});
			return dfd.promise;
		};

		//  @method register
		//  * Posts the current credentials to the registration endpoint.
		//  * @returns {Promise} A promise for the result of the registration call.
		Auth.prototype.register = function(email, password) {
			var dfd = $q.defer(),
				auth = this;
			$http
				.post(auth.apiUri + 'register', {
					email: email,
					password: password
				})
				.success(function(response) {
					dfd.resolve(response);
				})
				.error(function(response, status) {
					dfd.reject(response, status);
				});
			return dfd.promise;
		};

		//  @method confirm
		//  * Posts the given key to the confirmation endpoint and logs in the user.
		//  * @returns {Promise} A promise for the result of the confirmatoin call.
		Auth.prototype.confirm = function(key) {
			var dfd = $q.defer(),
				auth = this;
			$http
				.post(auth.apiUri + 'confirm', JSON.stringify(key)) 
				.success(function(response) {
					auth.setUser(response);
					dfd.resolve(response);
				})
				.error(function(response, status) {
					dfd.reject(response, status);
				});
			return dfd.promise;
		};

		// pass reset

		// /* @function storeHash_
		//  * Stores the passed hash in a cooke which expires in one year.
		//  * @param {string} hash Object returned by the verify or login call.
		//  */
		// function storeHash_(hash) {

		// 	// set the date to one full year from today
		// 	var expires = new Date();
		// 	expires.setFullYear(expires.getFullYear() + 1);

		// 	setHash_(hash, expires);
		// }

		// /* @function clearHash_
		//  * Clears any stored hash from cookies.
		//  */
		// function clearHash_() { setHash_(null, new Date()); }

		// /* @function setHash_
		//  * Sets a cookie with the passed hash which expires at the passed date.
		//  * @param {string} hash Hash to store in the cookie.
		//  * @param {Date} date Date for which the cookie should expire.
		//  */
		// function setHash_(hash, date) {

		// 	// and set the cookie with the correct hash
		// 	document.cookie = 'hash={hash}; expires={expires}; path=/'
		// 		.replace('{hash}', hash)
		// 		.replace('{expires}', date.toUTCString());
		// }
	});