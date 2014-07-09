var http = require('http'), fs = require('fs'), io = require('socket.io');
var server = http.createServer();

server.on('request', function(req, res) {
	res.writeHead(200, {
		'Content-type' : 'text/html'
	});
	res.end(fs.readFileSync(__dirname + '/index.html'));
});

server.listen(1334, function() {
	console.log('Listening at: http://localhost:1334');
});


var voters = [];
var querist = {};
io.listen(server).on('connection', function(socket) {
	console.log('Info: new client connected');
	socket.on('join_querist', function(data) {
		console.log('querist joined');
		if (!querist.uid || querist.uid != data.uid) {
			querist = data;
			socket.broadcast.emit('querist_joined', querist);
			socket.join(querist.uid);
			//http://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io #5
		}
		socket.emit('querist_joined', voters);
	});

	socket.on('quit_querist', function(data) {
		querist = {};
		socket.broadcast.emit('querist_quit', voters);
	});
	socket.on('quit_voter', function(data) {
		for (p in voters) {
			if (voters[p].id === data.id) {
				console.log('Voter ', voters.id, ' has quit');
				voters.splice(p);
				socket.broadcast.emit('voter_quit', data);
			}
		}
		socket.broadcast.emit('voter_quit', data);
		socket.broadcast.emit('voters', {
			voters : voters.length
		});
	});
	socket.on('join_voter', function(data) {
		console.log('voter_joined');
		voters.contains(data, function(found) {
			if (!found) {
				voters.push(data);
			}
			socket.broadcast.emit('voters', {
				voters : voters.length
			});
		});
	});
	// querist sends question:
	socket.on('questioned', function(data) {// with question
		socket.broadcast.emit('question', data.question);
	});
	// voters has answered:
	socket.on('answered', function(data) {// with answer
		socket.in(querist.uid).emit('answer', data.answer);
	});

});

Array.prototype.contains = function(k, callback) {
	var self = this;
	return ( function check(i) {
			if (i >= self.length) {
				return callback(false);
			}
			if (self[i].id === k.id) {
				return callback(true);
			}
			return process.nextTick(check.bind(null, i + 1));
		}(0));
};
