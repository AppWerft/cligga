/* static embeddings*/
var Cloud = require('ti.cloud');
var CloudPush = require('ti.cloudpush');

var Cligga = function() {
	this.eventhandlers = {};
	this.init();
};

Cligga.prototype = {
	init : function() {
		this.roomid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).replace(/[\D]/g, '').substring(0, 5);
		if (Ti.Android && Ti.Platform.Android.API_LEVEL > 12 && Ti.Network.online == true) {
			CloudPush.showTrayNotificationsWhenFocused = true;
			CloudPush.focusAppOnPush = false;
			CloudPush.showTrayNotification = false;
			CloudPush.singleCallback = false;
			var that = this;
			CloudPush.retrieveDeviceToken({
				success : function(e) {
					console.log('Info: deviceToken saved');
					Ti.App.Properties.setString('deviceToken', e.deviceToken);
					that.deviceToken = e.deviceToken;
					Cloud.Users.login({
						login : 'dummy',
						password : 'dummy'
					}, function(e) {
						that.login = true;
						console.log('Info: login into ACS ' + e.success);
						_callback && _callback(e);
					});
				},
				error : function(e) {
				}
			});
		}

	},
	getRoomId : function() {
		return this.roomid;
	},
	fireEvent : function(_event, _payload) {
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
	}
};

module.exports = Cligga;
