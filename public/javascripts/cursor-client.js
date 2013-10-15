var host = 'localhost';
var socket = io.connect('http://' + host + ':3000');
var cursor;
var myName;

var initUser = function(data){
	var tag = '';
	myName = data['user'];
	for(var i = 0; i < data['list'].length; i++)
		tag += data['list'][i]+'<br/>';
	$('.userlist').html(tag);
	$('.user').html('#my name : ' + myName);
	$('.cursor').addClass(myName);
	$('.cursor.' + myName).css({
		'background' : '#' + myName,
		'display' : 'block'
	});
	$('.cursor.' + myName).text(myName);
	$('body').bind('mousemove', function(e){
		cursor = $('.cursor.' + myName);
		$(cursor).css({'left' : e.pageX, 'top' : e.pageY});
		$('.position').text('x : ' + e.pageX + ', y : ' + e.pageY);
	});
	setInterval(function(){
		$('.heartbeat').css({'background' : '#ff0000'});
		setTimeout(function(){
			$('.heartbeat').css({'background' : '#ffffff'});
		}, 200);
	}, data['heartbeat']);
}

$().ready(function(){
	socket.on('initUser', function(data){
		initUser(data)
	});
	socket.on('refreshList',function(users){
		var tag = '';
		for(var i = 0; i < users.length; i++)
			tag += users[i]+'<br/>';
		$('.userlist').html(tag);
	});
});
