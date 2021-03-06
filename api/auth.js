var config = require('./config'),
	util = require('util'),
	express = require('express'),
	router = express.Router(),
	nodemailer = require('nodemailer'),
	uuid = require('node-uuid'),
	bcrypt = require('bcryptjs'),
	User = require('./models/user');

var smtp = nodemailer.createTransport({
    host: 'email-smtp.us-west-2.amazonaws.com',
    secureConnection: false,
    port: 587,
    auth: {
        user: 'AKIAJFEWYA7WAKH4E5VQ',
        pass: 'ArbsQxgZMFtPKIeewX/q6VLkasG8MqVgcLmUlHcGaEzJ'
    }
});

var salt = 12;

router.get('/verify', function(req, res) {
	verify(req, res, function(user) {
		res.json(user.toJson());
	});
});

router.post('/login', function(req, res) {

	if (!req.body.email 
		|| !req.body.password)
		res.send(400);

	User
		.find({ where: { email: req.body.email.toLowerCase() }})
		.then(function (user) {
			if (!user
				|| !bcrypt.compareSync(req.body.password, user.password)
				|| !user.can('login'))
				res.send(401, 'Invalid username or password');
			else {
				user.hash = uuid.v4();
				user.save();
				res.cookie(config.key, user.hash, { expires: new Date(Date.now() + 31536000000) });
				res.json(user.toJson());
			} 
		});
});

router.post('/logout', function(req, res) {
	if (!req.cookies[config.key])
		res.send(400);
	User
		.find({ where: { hash: req.cookies[config.key] }})
		.success(function (user) {
			if (user) {
				user.hash = undefined;
				user.save();
			}
			res.cookie(config.key, null, { maxAge: 0 });
			res.send(200);
		});
});

router.post('/register', function(req, res) {
	if (!req.body.email 
		|| !req.body.password)
		res.send(400);
	User
		.create({
			email: req.body.email.toLowerCase(),
			password: bcrypt.hashSync(req.body.password, salt) 
		}) 
		.complete(function(err, user) {
			if (err) {
				if (err.routine = '_bt_check_unique')
					res.send(400, 'Email address in use');
			}
			else {
				user.hash = uuid.v4();
				user.save();
				var confirmLink = config.protocol + '://' + config.hostname + 
					config.clientPath + '/#/login?confirm=' + user.hash;
				smtp.sendMail({
				    from: 'noreply@foursails.co',
				    to: user.email,
				    bcc: 'davis.matthewjames@gmail.com',
				    subject: 'Confirm your account with Places',
				    text: 'Please click the following link to confirm your '
				    	+ 'account:\n' + confirmLink
				});
				res.send(201);
			}
		});
});

router.post('/confirm', function(req, res) {
	if (!req.body)
		res.send(400);
	User
		.find({ where: { hash: req.body }})
		.then(function(user) {
			if (!user)
				res.send(404);
			user.allow('login');
			user.save();
			res.cookie(config.key, user.hash, { expires: new Date(Date.now() + 31536000000) });
			res.json(user.toJson());
		});
});

function verify(req, res, options, callback) {
	if (typeof options == 'function') {
		callback = options;
		options = null;
	}
	options = options || {};
	if (!req.cookies[config.key])
		res.send(401).end();
	User
		.find({ where: { hash: req.cookies[config.key] }})
		.then(function(user) {
			options.can = options.can || [];
			if (!user || !user.can('login'))
				res.send(401).end();
			if (!util.isArray(options.can))
				options.can = [options.can];
			if (!options.can.every(user.can.bind(user)))
				res.send(403).end();
			if (callback)
				callback(user);
		});
}

module.exports = {
	verify: verify,
	routes: router
};