
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var crypto = require('crypto');

var cursor = require('./cursor');

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
app.use(express.session({
    secret: 'secret key'
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/cursor', function(req, res) {
    res.render('cursor', {
        title: 'Hello'
    });
});

// server listen port 3000
var io = require('socket.io').listen(app.listen(port));

// live log
io.set('log level', 2);

var heartbeat = 2000;
// var users = [];

var getSocketHashID = function(socketID) {
    return crypto.createHash('sha1').update(socketID).digest('hex').slice(0, 6);
};

io.sockets.on('connection', function(socket) {
    var user = getSocketHashID(socket.id);
    var users = [];

    console.log('connect user : ' + socket.id);

    for (socketId in io.sockets.sockets) {
        var socketHash = getSocketHashID(io.sockets.sockets[socketId].id);
        users.push(socketHash);
    }

    // emit initUser
    socket.emit('initUser', {
        list: users,
        user: user,
        heartbeat: heartbeat
    });

    socket.on('refreshPoint', function(data) {
        socket.broadcast.emit('updatePoint', data);
    });

    // broadcast emit refreshList
    socket.broadcast.emit('refreshList', users);

    // on disconnect
    socket.on('disconnect', function() {
        //remove user from socket list
        var socketHash = getSocketHashID(socket.id);
        var index = users.indexOf(socketHash);
        users.splice(index, 1);
        socket.broadcast.emit('refreshList', users);
    });

});
