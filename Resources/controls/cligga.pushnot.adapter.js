/* static embeddings*/
var Cloud = require('ti.cloud');
var CloudPush = require('ti.cloudpush');

/* constructor */
var Cligga = function() {
	this.eventhandlers = {};
	this.init();
};

Cligga.prototype = {
	init : function() {
		this.roomid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).replace(/[\D]/g, '').substring(0, 5);
		this.loggedin = false;
		var that = this;
		if (Ti.Android && Ti.Platform.Android.API_LEVEL > 12 && Ti.Network.online == true) {

			CloudPush.showTrayNotificationsWhenFocused = true;
			CloudPush.focusAppOnPush = false;
			CloudPush.showTrayNotification = false;
			CloudPush.singleCallback = false;
			CloudPush.retrieveDeviceToken({
				success : function(e) {
					Ti.App.Properties.setString('deviceToken', e.deviceToken);
					that.deviceToken = e.deviceToken;
					Cloud.Users.login({
						login : "dummy",
						password : "dummy"
					}, function(e) {
						if (e.success) {
							var user = e.users[0];
							alert('Success:\n' + 'id: ' + user.id + '\n' + 'sessionId: ' + Cloud.sessionId + '\n' + 'first name: ' + user.first_name + '\n' + 'last name: ' + user.last_name);
						} else {
							alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						}
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
