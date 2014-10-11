// Include gulp and plugins
var gulp = require('gulp'),
	sftp = require('gulp-sftp');

var allFiles = [
	'*.js',
    'models/*',
    '!config.js',
    '!gulpfile.js',
	'package.json'
]

gulp.task('ftp', function () {
    return gulp.src(allFiles, { base: './' })
        .pipe(sftp({
            host: 'foursails.co',   
            port: '22',
            user: 'places',
            pass: 'FS2014p',
            remotePath: '/api/'     
        }));
});

// Default Task
gulp.task('default', [
	'ftp'
]);
