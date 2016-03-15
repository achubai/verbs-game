/**
 * Created by achubai on 10/28/2015.
 */

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var Schema = mongoose.Schema;
var schedule = require('node-schedule');
var crypto = require('crypto-js');

var SECRET = 'secret';

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('db-uri', 'mongodb://localhost/verbs');

mongoose.connect(app.set('db-uri'));

var verbSchema = new Schema({
    v1: String,
    v2: String,
    v3: String,
    ing: String,
    translate: String
}
    //, {collection: 'verbs'}
);

var userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    permission: String,
    settings: {
        verbs: {
            number: Number,
            complexity: Boolean
        }
    },
    startDate: {
        month: Number,
        day: Number,
        year: Number
    }

}
    //, {collection: 'users'}
);

var tokensSchema = new Schema({
    token: String,
    valid: Boolean
}
    //, {collection: 'users'}
);

var Verb = mongoose.model('Verb', verbSchema, 'verbs');
var User = mongoose.model('User', userSchema, 'users');
var Token = mongoose.model('Token', tokensSchema, 'tokens');

mongoose.connection.on('connected', function () {
    console.log('connected to verbs');
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose verbs connection error: ' + err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var userSession = {
    userId: null,
    token : null,
    tokenValid: false,
    permission: null,
    password: null,
    settings: {
        verbs: {
            number: null,
            complexity: false
        }
    }
};


// not protected
router.route('/verbs')
    .get(function(req, res) {
        Verb.find(function(err, verbs) {
            if (err)
                res.send(err);

            res.json(verbs);
        });
    });

// not protected
router.route('/users')
    .post(checkRegistrationEmailExist,checkRegistrationLoginExist, function(req, res){
        var user = new User();
        var date = new Date();

        user.email = req.body.email;
        user.username = req.body.username;
        user.permission = 'user';
        user.password = req.body.password;
        user.settings.verbs.number = 15;
        user.settings.verbs.complexity = false;
        user.startDate.day = date.getDate();
        user.startDate.month = date.getMonth() + 1;
        user.startDate.year = date.getFullYear();

        user.save(function(err, mod) {
            if (err) {
                res.send(err);
            } else {
                saveToken(createToken(user, res), res);
            }

        });
    });

// not protected
router.route('/signin')
    .post(function (req, res) {
        User.findOne({
            username: req.body.username
        }, function (err, user){

            if (err) res.send(err);

            if(!user) {

                res.json({
                    success: false,
                    err: 'user',
                    message: 'User not found.'
                });

            } else if (user) {
                if (user.password !== req.body.password) {

                    res.json({
                        success: false,
                        err: 'password',
                        message: 'Wrong password.'
                    });

                } else {

                    saveToken(createToken(user, res), res);
                }
            }
        });
    });

// not protected
router.route('/logout')
    .post(function(req, res) {
        var userData = JSON.parse(req.headers['x-access-user']);

        Token.findOne({token: userData.token}, function (err, token) {
            if (err) {
                res.send(err)
            } else {
                token.valid = false;

                res.json({
                    success: false,
                    message: 'Logout'
                })
            }
        })
    });

router.use(verifyToken);

// protected
router.route('/users/:id')
    .get(function (req, res) {
        console.log('user', userSession.userId);
        User.findById(userSession.userId, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    username: user.username,
                    email: user.email
                });
            }
        });
    });

// protected
router.route('/users/:id/password')
    .put(function (req, res) {

        User.findById(userSession.userId, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                if (req.body.currentPassword === user.password) {

                    if (req.body.newPassword === req.body.confirmPassword) {

                        user.password = req.body.newPassword;

                        user.save(function (err) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.json({
                                    status: 'ok',
                                    message: 'Password was changed'
                                })
                            }
                        });

                    } else {
                        res.json({
                            err: 'confirmPassword',
                            message: 'The confirm password do not match.'
                        })
                    }

                } else {
                    res.json({
                        err: 'currentPassword',
                        message: 'The provided password is incorrect.'
                    })
                }
            }
        });
    });

// protected
router.route('/users/:id/settings')
    .put(function (req, res) {

        User.findById(userSession.userId, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                user.settings.verbs.number = req.body.verbsNumber;
                user.settings.verbs.complexity = !!req.body.verbsComplexity;

                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({
                            verbs: {
                                number: user.settings.verbs.number,
                                complexity: user.settings.verbs.complexity
                            }
                        });
                    }
                })

            }
        });
    });

router.route('/verifyUser')
    .post(function(req, res){
        res.json({
            id: userSession.userId,
            tokenValid: true,
            permission: userSession.permission
        })
    });

router.use(checkPermissions);

// protected
router.route('/verbs')
    .post(function(req, res) {

        var verb = new Verb();

        verb.v1 = req.body.v1;
        verb.v2 = req.body.v2;
        verb.v3 = req.body.v3;
        verb.ing = req.body.ing;
        verb.translate = req.body.translate;

        verb.save(function(err, mod) {
            if (err)
                res.send(err);

            res.json({ message: 'Verb created!', id: mod._id });
        });
    });

// protected
router.route('/verbs/:id')
    .put(function (req, res) {
        Verb.findById(req.params.id, function(err, verb){
            if (err)
                res.send(err);

            verb.v1 = req.body.v1;
            verb.v2 = req.body.v2;
            verb.v3 = req.body.v3;
            verb.ing = req.body.ing;
            verb.translate = req.body.translate;

            verb.save(function (err) {
                if (err)
                    res.send(err);
            });
        });
    })
    .get(function (req, res) {
        Verb.findById(req.params.id, function(err, verb){
            if (err)
                res.send(err);

            res.json(verb);
        });
    })
    .delete(function (req, res) {
        Verb.remove({
            _id: req.params.id
        }, function(err, verb) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        })
    });

// protected
router.route('/users')
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            } else {

                for (var i = 0, length = users.length; i < length; i++) {
                    users[i].password = null;
                }
                
                res.json({
                    users: users
                });
            }
        });
    });

// protected
router.delete('/users/:id', function (req, res) {
        User.remove({
            _id: req.params.id
        }, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'User deleted' });
            }
        });
    });



// middlewares

function createToken (user, res) {
    var tokenData = {
        id: user._id,
        permission: user.permission,
        time: (new Date()).getTime()
    };

    var token = (crypto.AES.encrypt(JSON.stringify(tokenData), SECRET)).toString();

    res.json({
        id: user._id,
        token: token,
        permission: user.permission,
        settings: {
            verbs: {
                complexity: user.settings.verbs.complexity,
                number: user.settings.verbs.number
            }
        }
    });

    return token;
}

function saveToken (data, res) {
    var token = new Token();

    token.token = data;
    token.valid = true;

    token.save(function(err){
        if(err) res.send(err)
    })
}

function decryptToken (token) {

    var bytes  = crypto.AES.decrypt(token, SECRET);
    return  JSON.parse(bytes.toString(crypto.enc.Utf8));
}


function verifyToken (req, res, next){

    var userData = {};

    if (req.headers['x-access-user']) {
        userData = JSON.parse(req.headers['x-access-user']);
    }

    if(userData.token) {
        Token.findOne({'token': userData.token}, function(err, token) {
            if (err) {
                res.send(err);
            } else {
                if (token) {
                    if (token.valid) {
                        userSession.token = token.token;
                        var data = decryptToken(token.token);

                        userSession.userId = data.id;
                        userSession.permission = data.permission;
                        userSession.tokenValid = true;

                        next();
                    } else {
                        res.json({
                            tokenValid: userSession.tokenValid,
                            message: 'token outdated!'
                        })
                    }
                } else {
                    res.json({
                        tokenValid: userSession.tokenValid,
                        message: 'No token in db'
                    })
                }
            }
        })
    } else {
        res.json({
            tokenValid: userSession.tokenValid,
            message: 'No userToken!'
        });
    }
}

function checkPermissions (req, res, next){
    if (userSession.permission === 'admin'){
        next();
    } else {
        console.log('No permissions');
        res.json({
            success: false,
            message: 'No permissions'
        })
    }
}

function checkRegistrationEmailExist (req, res, next) {
    User.findOne({email: req.body.email}, function(err, email) {
        if(err) res.send(err);

        if (email){
            res.json({
                success: false,
                err: 'email',
                message: 'Email is busy'
            });
        } else {
            next();
        }
    });
}

function checkRegistrationLoginExist(req, res, next){
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) res.send(err);

        if (user){
            res.json({
                success: false,
                err: 'user',
                message: 'User is busy'
            })
        } else {
            next();
        }
    });
}


var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 0, 59);

schedule.scheduleJob(rule, function(){
    Token.update({valid: true}, {valid: false}, function(err, token) {
        if(err) {
            throw err;
        } else {
            userSession.tokenValid = false;
            console.log('Tokens not actual');
        }
    })
});


app.use('/api', router);
app.listen(3000);
