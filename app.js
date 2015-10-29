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

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.sendfile(path.join(__dirname+'/index.html'));
});

router.get('/admin', function (req, res) {
    res.sendfile(path.join(__dirname+'/admin.html'));
});

app.use('/api', router);
app.listen(3000);