/* Module globals */
var uid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).substring(0, 5);
var roomid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).replace(/[\D]/g, '').substring(0, 5);

var WSURL = Ti.App.Properties.getString('cliggauri');

/* constructor */
var Cligga = function() {
	this.eventhandlers = [];
	/*this.socket = require('net.iamyellow.tiws').createWS();

	this.socket.addEventListener('open', function() {
		Ti.API.debug('websocket opened');
	});

	this.socket.addEventListener('close', function(ev) {
		Ti.API.info(ev);
	});

	this.socket.addEventListener('error', function(ev) {
		Ti.API.error(ev);
	});

	this.socket.addEventListener('message', function(ev) {
		Ti.API.log(ev);
	});
	this.socket.open(WSURL);
	*/
	 this.socket = require('vendor/socket.io.0.9.10').connect('ws://134.100.29.95:1334');
	 console.log('Info: socket connected ~~~~~~~' + this.socket);
	 this.socket.on('connect', function () {
	 Ti.API.log('connected!');
	 });
	 this.socket.on('voter_joined', function(_payload) {
	 });
	 this.socket.on('voters', function(_payload) {
	 that.fireEvent('voters', _payload);
	 });
	 this.socket.on('question', function(_payload) {
	 that.fireEvent('newquestion', _payload);
	 });
	 this.socket.on('voter_quit', function(_payload) {
	 });
	/*
	 setInterval(function() {
	 console.log(that.socket.connected);
	 if (!that.socket.connected && !that.socket.connecting) {
	 //	console.log('Warning: reconnect inside cron');
	 //		that.socket = socketio.connect(this.socketURL);
	 }

	 }, 5000);*/
	return this;
};

/* prototyped methods */
Cligga.prototype = {
	getRoomId : function() {
		return roomid;
	},
	fireEvent : function(_event, _payload) {
		console.log('Info: try to fire event ' + _event);
		if (this.eventhandlers[_event]) {
			for (var i = 0; i < this.eventhandlers[_event].length; i++) {
				this.eventhandlers[_event][i].call(this, _payload);
			}
		}
	},
	addEventListener : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			this.eventhandlers[_event] = [];
		this.eventhandlers[_event].push(_callback);
	},
	removeEventListener : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			return;
		var newArray = this.eventhandlers[_event].filter(function(element) {
			return element != _callback;
		});
		this.eventhandlers[_event] = newArray;
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
		this.addEventListener(payload.id, _callback);
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
		this.addEventListener(_payload.id, _callback);
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
