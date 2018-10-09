var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.Promise = global.Promise;

// mongoose connection
mongoose.connect(config.dbUrl);

// check mongoose connection error
mongoose.connection.on('error', function (err) {
    console.log(err);
});

var app = express();

// parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// get resource related routes
var route = require('./routes/resource');

// set api route
app.use('/api/v1', route);

// static the client files
app.use(express.static('client/build'));

// cors configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Accept-Encoding ,authorization,content-type, enctype');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,PATCH');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Access-Control-Max-Age', '3000');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// satrt the server
var server = app.listen(config.port, () => {

    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)

});

// log the system error
process.on('uncaughtException', function (err) {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1)
})