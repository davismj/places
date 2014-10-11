angular.module('translate', ['pascalprecht.translate'])
	.config(function($translateProvider) {

	    $translateProvider.translations('en', {
	    	LATITUDE: 'Latitude',
	    	LONGITUDE: 'Longitude',
	    	NAME: 'Name',
	    	SUBMIT: 'Submit',
	    	EMAIL: 'Email',
	    	CANCEL: 'Cancel',
	    	LOGIN: 'Login',
	    	LOGOUT: 'Logout',
	    	CHECKIN: 'Check In',
	    	CHECKEDIN: 'Checked In',
	    	PASSWORD: 'Password',
	    	LANGUAGE: 'Language',
	    	ENGLISH: 'English',
	    	JAPANESE: 'Japanese',
	    	LEAVE_REVIEW: 'Leave Review' });
	    
	    $translateProvider.translations('jp', {
	    	LATITUDE: '緯度',
	    	LONGITUDE: '経度',
	    	NAME: '名前',
	    	SUBMIT: '送信',
	    	LANGUAGE: '文語',
	    	ENGLISH: '英語',
	    	JAPANESE: '日本語' });

		$translateProvider.preferredLanguage('en');
		$translateProvider.fallbackLanguage('en'); })
