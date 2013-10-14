var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var app = express();

// all environments
var port = 3000;
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret : 'secret key'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//
var cursor = require('./cursor');

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/cursor', function(req, res){
	res.render('cursor', {name : id, user : cursor.users});
	console.log(id + " connect.");
	console.log(cursor.users);
});


// server listen port 3000
var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function(socket){
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	var id = crypto.createHash('sha1').update(current_date + random).digest('hex');
	id = id.substr(id.length - 6);

	cursor.addUser(id);
	res.render('cursor', {name : id, user : cursor.users});
});


