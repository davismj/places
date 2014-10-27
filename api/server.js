var express = require('express'),
	app = express(),
	router = express.Router(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	config = require('./config'),
	auth = require('./auth'),
	user = require('./user'),
	location = require('./location');

require('./badge');

router.use('/location', location.routes);
router.use('/user', user.routes);
router.use('/auth', auth.routes);
app.use(bodyParser.json({strict:false, limit: 2000000}));
app.use(cookieParser());
app.use(config.path, router);
app.listen(config.port);