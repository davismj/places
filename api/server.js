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
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(config.path, router);
app.listen(config.port);

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });