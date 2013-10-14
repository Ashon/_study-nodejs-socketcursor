var host = 'localhost';
var socket = io.connect('http://' + host + ':3000');

socket.on('refreshList', function(list){
	var tag = '';
	for(var i = 0; i < list['list'].length; i++)
		tag += list['list'][i]+'<br/>';
	$('.userlist').html(tag);
})