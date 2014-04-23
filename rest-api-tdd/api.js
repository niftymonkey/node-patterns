var express = require("express"),
    bodyParser = require("body-parser"),
    mongoskin = require("mongoskin");

// initialize a server object
var app = express();

// configure express to use the bodyParser middleware
app.use(bodyParser());

// setup the mongo db interface via mongoskin
var db = mongoskin.db("localhost:27017/test");

// every time there is a "collectionName" parameter in the URL pattern of the request handler,
// set the request.collection to the collection matching that name in the db
app.param("collectionName", function(req, res, next, collectionName) {
    req.collection = db.collection(collectionName);
    console.log(res.collection.find());
});

// put in a user-friendly message if they go to root
app.get("/", function(req, res, next) {
    res.send("Please select a collection, e.g. /collections/messages");
});

/////////////////////////////////////////////////////////
// API Implementations
/////////////////////////////////////////////////////////

app.get("/collections/:collectionName", function(req, res, next) {
    req.collection.find({
        sort: [["_id",-1]]
    }).toArray(function(e, results) {
        if(e) {
            return next(e);
        } else {
            res.send(results);
        }
    });
});

app.post('/collections/:collectionName', function (req, res, next) {
    req.collection.insert(req.body, {}, function (e, results) {
        if(e) {
            return next(e);
        }
        res.send(results);
    });
});

app.get('/collections/:collectionName/:id', function (req, res, next) {
    req.collection.findOne({_id: req.collection.id(req.params.id)}, function (e, results) {
        if(e) {
            return next(e);
        } else {
            res.send(results);
        }
    });
});

app.put('/collections/:collectionName/:id', function (req, res, next) {
    req.collection.update({_id: req.collection.id(req.params.id)}, {$set: req.body}, {safe: true, multi: false}, function (e, results) {
        if(e) {
            return next(e);
        } else {
            res.send((results === 1) ? {msg: 'success'} : {msg: 'error'});
        }
    });
});

app.del('/collections/:collectionName/:id', function (req, res, next) {
    req.collection.remove({_id: req.collection.id(req.params.id)}, function (e, results) {
        if(e) {
            return next(e);
        } else {
            res.send((results === 1) ? {msg: 'success'} : {msg: 'error'});
        }
    });
});


// start the server
app.listen(3000);