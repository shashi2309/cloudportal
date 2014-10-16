var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var KeystoneStrategy = require('passport-keystone').Strategy;

exports.setup = function(User, config) {

	passport.use(new KeystoneStrategy({
		usernameField : 'username',
		passwordField : 'password', // this is the virtual field on the model
		//authUrl: 'https://identity.api.rackspacecloud.com',
		authUrl : '10.230.22.160:5000',
		region : 'RegionOne',
		passReqToCallback : true
	// allows us to interact with req object
	}, function(req, identity, done) {
		if (!req.user) {

			User.findOne({
				'name' : identity.user.name
			}, function(err, user) {
				if (!user) {
					user = new User({
						name : identity.user.name,
						username : identity.user.username,
						role : identity.user.roles[0].name,
						provider : 'keystone',
						keystone : identity._json
					});
					user.save(function(err) {

						if (err) {
							console.log('##ERROR' + err);
							done(err);
						}
						return done(err, user);
					});

					// Set session expiration to token expiration
					req.session.cookie.expires = Date
							.parse(identity.token.expires)
							- Date.now();
					done(null, user);

				} else {
					// Set session expiration to token expiration
					req.session.cookie.expires = Date
							.parse(identity.token.expires)
							- Date.now();
					done(null, user);
				}
			});

		} else {
			// user already exists
			var user = req.user; // pull the user out of the session
			return done(null, user);
		}
	}));
};