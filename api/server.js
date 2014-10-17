var express = require('express'),
	app = express(),
	router = express.Router(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	config = require('./config'),
	auth = require('./auth'),
	awards = require('./badge'),
	location = require('./location');

router.get('/', function(req, res) {
	res.json({ Hello: "Treyland!" });	
});

router.use('/location', location.routes);
router.use('/auth', auth.routes);

app.use(bodyParser.json({strict:false}));
app.use(cookieParser());
app.use(config.path, router);
app.listen(config.port);