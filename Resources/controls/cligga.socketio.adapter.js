/* Module globals */
var uid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).substring(0, 5);
var roomid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).replace(/[\D]/g, '').substring(0, 5);

var WSURL = Ti.App.Properties.getString('cliggauri');

/* constructor */
var Cligga = function() {
	this.eventhandlers = [];

	var query = 'description=' + Ti.Network.encodeURIComponent(Ti.App.description) + '&guid=' + Ti.App.guid + '&id=' + Ti.App.id + '&name=' + Ti.App.name + '&version=' + Ti.App.version + '&installId=' + Ti.App.installId;
	this.socket = require('vendor/socket.io.0.9.16').connect('ws://134.100.29.95:1334', {
		'transports' : ['websocket'],
		'reconnect' : true,
		'reconnection delay' : 100,
		'reconnection limit' : 5000,
		'max reconnection attempts' : Infinity,
		'query' : query
	});
	console.log('Info: socket connected ~~~~~~~' + this.socket);
	console.log(query);
	this.socket.on('connect', function() {
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
