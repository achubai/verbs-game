/**
 * Created by achubai on 10/28/2015.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var http = require('http');
var path    = require("path");
var mongo = require('mongodb');
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('./auth');
var router = express.Router();
var bodyParser = require('body-parser');
var exports = module.exports = {};
var db;
var Schema = mongoose.Schema;
var verbSchema;
var Verb;

var app = express();

app.use(express.static(__dirname + '/public'));
app.set('db-uri', 'mongodb://localhost/verbs');

db = mongoose.connect(app.set('db-uri'));

verbSchema = new Schema({
    v1: String,
    v2: String,
    v3: String,
    ing: String,
    translate: String
}, {collection: 'verbs'});

Verb = mongoose.model('Verb', verbSchema, 'verbs');

mongoose.connection.on('connected', function () {
    console.log('connected to verbs');
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose verbs connection error: ' + err);
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'some secret',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());

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
    })
    .get(function(req, res) {

        console.log(req.cookies);
        console.log('===================');
        console.log(req.session);

        Verb.find(function(err, verbs) {
            if (err)
                res.send(err);

            res.json(verbs);
        });
    });

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

app.use('/api', router);
app.listen(3000);
