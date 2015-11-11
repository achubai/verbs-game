/**
 * Created by achubai on 11/9/2015.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local-signup', new LocalStrategy({
        username: 'username',
        password: 'password'
    },
    function(req, username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }

            if (user) {
                return done(null, false, { message: 'this username is busy.' });
            } else {
                var newUser = new User();
                newUser.username = username;
                newUser.password = password;

                newUser.save(function(err) {
                    if (err)
                        res.send(err);

                    done(null, newUser);
                });
            }

        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user){
        done(err, user);
    });
});

module.exports = passport;