/**
 * Created by achubai on 11/9/2015.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        if(password == 'admin') {
            return done(null, {username: 'admin'});
        }

        return done(null, false);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.user.username);
});

passport.deserializeUser(function (username, done) {
    done(null, {username: username});
});

module.exports = passport;