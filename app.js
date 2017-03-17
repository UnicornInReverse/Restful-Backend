var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost:27017/musicAPI');
var Album = require('./models/albumModel');
var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Accept', 'application/json');
    if (!req.accepts('json')) {
        res.status(415);
        res.end();
    }
    else {
        next();

    }
});


musicRouter = require('./Routes/musicRoute')(Album);

app.use('/api/albums', musicRouter);

app.listen(port, function () {
    console.log('Gulp is running on port:' + port);
});
