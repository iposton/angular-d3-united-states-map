var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8082;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/client/app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the home page route
app.get('/', function(req, res) {

    // make sure index is in the right directory. In this case /app/index.html
    res.render('index');
});

// for heroku config vars
app.get('/config.js', function(req, res){
       res.write("var API_KEY='"+process.env.API_KEY+"'" + '\n');
       res.end();
});



app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});