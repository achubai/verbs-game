/**
 * Created by achubai on 10/28/2015.
 */

var express = require('express');
var http = require('http');
var path    = require("path");
var mongo = require('mongodb');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');

var Schema = mongoose.Schema;

mongoose.connect('localhost:27017/verbs');

mongoose.connection.on('connected', function () {
    console.log('connected to verbs');
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose verbs connection error: ' + err);
});

var verbSchema = new Schema({
    id: Number,
    v1: String,
    v2: String,
    v3: String,
    ing: String,
    translate: String
}, {collection: 'verbs'});

var Verb = mongoose.model('Verb', verbSchema, 'verbs');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exports = module.exports = {};

exports.index = function (req, res) {
    res.render('index.html');
};

router.route('/', router.index);

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
