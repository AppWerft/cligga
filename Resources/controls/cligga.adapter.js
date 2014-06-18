var uid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).substring(0, 3);
var roomid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).replace(/[\D]/g, '').substring(0, 5);
var socketio = require('vendor/socket.io');

var Cligga = function() {
	this.socket = socketio.connect(Ti.App.Properties.getString('cliggauri'));
	this._cbhandlers = [];
	var that = this;
	this.socket.on('connect', function() {
		Ti.API.log('connected!');
	});

	this.socket.on('voter_joined', function(_payload) {
		if (that._cbhandlers) {
			for (var item in that._cbhandlers) {
				that._cbhandlers[item].call(that, {
					voters : _payload
				});
			}
		}

	});
	this.socket.on('question', function(_payload) {
		if (that._cbhandlers)
			for (var item in that._cbhandlers) {
				that._cbhandlers[item].call(that, _payload);
			}
		;
	});
	this.socket.on('voter_quit', function(_payload) {
		if (that._cbhandlers)
			for (var item in that._cbhandlers) {
				that._cbhandlers[item].call(that, {
				});
			}
		;
	});
	console.log('Info: Cligga constructor succeded, all event listener initialized');
	return this;
};

Cligga.prototype = {
	getRoomId : function() {
		return roomid;
	},
	sendQuestion : function(_question) {
		var payload = {
			"id" : uid,
			"question" : _question
		};
		this.socket.emit('questioned', payload);

	},
	joinquerist : function(_callback) {
		var payload = {
			"id" : uid,
		};
		this._cbhandlers[payload.id] = _callback;
		this.socket.emit('join_querist', payload);
	},
	quitquerist : function() {
		var payload = {
			"id" : uid,
		};
		this.socket.emit('quit_querist', payload);
	},
	joinvoter : function(_callback) {
		var payload = {
			"id" : uid,
		};
		this._cbhandlers[payload.id] = _callback;
		this.socket.emit('join_voter', payload);
	},
	quitvoter : function() {
		var payload = {
			"id" : uid,
		};
		this.socket.emit('quit_voter', payload);
	},
};

module.exports = Cligga;
