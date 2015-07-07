
var socket = io.connect(location.origin);

var cursor;
var myName;
var pos;
var userlist = {};

var initializeUserList = function(users) {

    var tag = '';

    $('.cursor').each(function() {
        if(!$(this).hasClass(myName))
            this.remove();
    });

    var index = users.indexOf(myName);
    // users.splice(index, 1);

    users.forEach(function(user) {
        if(user !== myName || userlist[myName] === undefined) {
            userlist[user] = $('<div></div>')
                .html(user)
                .addClass('cursor')
                .addClass(user)
                .css({
                    'background': '#' + user,
                    'display': 'block'
                })
                .appendTo('.cursors');
            if(user !== myName)
                $(userlist[user]).addClass('other');
        }
        tag += user + '<br/>';
    });

    $('.userlist').html(tag);
};

var initUser = function(data) {
    var tag = '';

    myName = data['user'];

    $('html').bind('mousemove', function(e) {
        cursor = $('.cursor.' + myName);
        pos = {
            'left': e.pageX,
            'top': e.pageY
        };
        $(cursor).css(pos);

        $('.position').text('x : ' + e.pageX + ', y : ' + e.pageY);
    });

    setInterval(function() {

        $('.heartbeat').css({
            'background': '#ff0000'
        });

        socket.emit('refreshPoint', {
            'id': myName,
            'color': '#' + myName,
            'pos': pos
        });

        setTimeout(function() {
            $('.heartbeat').css({
                'background': '#ffffff'
            });
        }, 200);

    }, data['heartbeat']);

};

var socketRoutes = [
    {
        'name': 'initUser',
        'handler': function(data) {
            initUser(data);
            initializeUserList(data.list);
        }
    }, {
        'name': 'refreshList',
        'handler': function(users) {
            initializeUserList(users);
        }
    }, {
        'name': 'updatePoint',
        'handler': function(data) {
            if(userlist[data.id] !== undefined)
                $(userlist[data.id]).css(data.pos);
        }
    }
];

$().ready(function() {
    socketRoutes.forEach(function(route) {
        socket.on(route.name, route.handler);
    });
});
