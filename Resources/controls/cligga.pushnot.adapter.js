/* static embeddings*/
var Cloud = require('ti.cloud');

/* constructor */
var Cligga = function() {
	this.eventhandlers = {};
	this.deviceToken = null;
	this.roomid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).replace(/[\D]/g, '').substring(0, 5);
	this.loginUser();
};

Cligga.prototype = {
	loginUser : function() {
		var that = this;
		Cloud.Users.login({
			login : "dummy",
			password : "dummy"
		}, function(e) {
			if (e.success) {
				that.fireEvent('user_loggedin', {
					user : e.users[0]
				});
				that._startNotification();
				console.log('Info: user login was successful ~~~~~~~~~~~~~~~~~~~~');
			} else {
				console.log('Error: user login failed');
			}
		});
	},
	_startNotification : function() {
		this.loggedin = false;
		var that = this;
		if (Ti.Android && Ti.Platform.Android.API_LEVEL > 12 && Ti.Network.online == true) {
			var CloudPush = require('ti.cloudpush');
			CloudPush.showTrayNotificationsWhenFocused = true;
			CloudPush.focusAppOnPush = true;
			CloudPush.showTrayNotification = false;
			CloudPush.singleCallback = false;
			CloudPush.retrieveDeviceToken({
				success : function(e) {
					Ti.App.Properties.setString('deviceToken', e.deviceToken);
					console.log('Info: subscribing to pushnot was successful ~~~~~~~~~~~~~~~~~~' + e);
					that.deviceToken = e.deviceToken;

				},
				error : function(e) {
					console.log('Error: ' + e);
				}
			});
		}
		if (!Ti.Android) {// iPhone/iPad
			Ti.Network.registerForPushNotifications({
				success : function(e) {
					that.deviceToken = e.deviceToken;
					console.log('Info: successful subscribed for pushnot');
				},
				error : function(e) {
					console.log('Error: ~~~~~~~~~~~~~~~~~~~');
					console.log(JSON.stringify(e));
				},
				callback : function(e) {
					alert(e);
				},
				types : [Ti.Network.NOTIFICATION_TYPE_ALERT] // [Ti.Network.NOTIFICATION_TYPE_ALERT]
			});
		}
		Ti.Android && CloudPush.addEventListener('callback', function(_payload) {
			Ti.API.info(_payload);
		});
	},

	getRoomId : function() {
		return this.roomid;
	},
	sendQuestion : function() {
	},
	joinRoom : function(_channel, _callback) {
		var that = this;
		console.log('Info: TOKEN=' + this.deviceToken);
		console.log('Info: CHANNEL=' + _channel);
		Cloud.PushNotifications.subscribe({
			channel : _channel,
			device_token : that.deviceToken,
			type : Ti.Platform.name == 'android' ? 'android' : 'ios'
		}, function(e) {
			console.log(e);
		});
	},
	quitRoom : function(_channel, _callback) {
		var that = this;
		Cloud.PushNotifications.unsubscribe({
			channel : _channel,
			device_token : that.deviceToken,
			type : Ti.Platform.name == 'android' ? 'android' : 'ios'
		}, _callback);
	},
	/* standard methods for event/observer pattern */
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
