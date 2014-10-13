var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var KeystoneStrategy = require('passport-keystone').Strategy;

exports.setup = function (User, config) {
/* passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
	
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));*/
	
	passport.use(new KeystoneStrategy({
		usernameField: 'username',
		passwordField: 'password', // this is the virtual field on the model
	    //authUrl: 'https://identity.api.rackspacecloud.com',
		authUrl: '10.230.22.160:5000',
	    region: 'RegionOne',
	    passReqToCallback : true // allows us to interact with req object
	}, function(req, identity, done) {
	  if (!req.user) {
	    /*var user = {
	        id: identity.user.id,
	        token: identity.token.id,
	        username: identity.user.name,
	        serviceCatalog: identity.raw.access.serviceCatalog
	    };*/
	    
	   /* var user1 = identity.user;
	      var output = '';
	      for (var property in user1) {
	        output += property + ': ' + user1[property]+'; ';
	      }
	     // console.log('##USER PROP ...'+identity.user.name);
	      
	      User.findOne({'name':'cloudportal'}, function(err, user) {
	          if (err) throw err
	          console.log(user.name + " has the power ");
	      });*/
	      
	      
	      
	      User.findOne({
	          'name': identity.user.name
	        }, function(err, user) {
	          if (!user) {
	        	  console.log('##USER NOT FOUND');
	        	    user = new User({
	            	name: identity.user.name,
	 	            username: identity.user.name,
	 	            role: 'user',
	 	            provider: 'keystone'
	            });
	            user.save(function(err) {
	              if (err) done(err);
	              	return done(err, user);
	            });
	          } else {
	        	  if(!user){
	      	    	console.log('USER IS NULL');
	      	    }

	      	    // Set session expiration to token expiration
	      	    req.session.cookie.expires = Date.parse(identity.token.expires) - Date.now();

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