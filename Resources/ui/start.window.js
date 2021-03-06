exports.create = function() {
	function onClick(_e) {
		self.remove(left);
		self.remove(right);
		color = (_e.source.itemId == 'q') ? '#942625' : '#497E30';
		type = _e.source.itemId;

		label.setText((_e.source.itemId == 'q') ? 'Raumnummer\n' + Ti.App.Cligga.getRoomId() : 'Du bist Antworter.\nTrage jetzt den Raum ein, den der Frager vorgegeben hat');
		label.setColor(color);
		label.animate({
			top : 0,
			bottom : null
		});
		container.backgroundImage = '/assets/' + _e.source.itemId + '.png';
		if (type == 'a')
			keyboard.animate({
				bottom : 0
			});
		else {
			self.addEventListener('click', function() {
				var win2 = require('ui/q').create(color, Ti.App.Cligga.getRoomId());
				if (Ti.Android)
					win2.open();
				else
					navwin.openWindow(win2, {
						animated : true
					});
			});
		}
	};
	var color, type;

	if (Ti.Android) {
		var self = Ti.UI.createWindow({
			exitOnClose : true,
			navBarHidden : true,
			fullscreen : true
		});
	} else {
		var self = Ti.UI.createWindow({
			fullscreen : true,title:'Cligga'
		});
		var navwin = Titanium.UI.iOS.createNavigationWindow({
			window : self
		});
	}

	if (!Ti.Network.online) {
		var dialog = Ti.UI.createAlertDialog({
			message : 'Diese App braucht das Internet',
			ok : 'Verstanden',
			title : 'Netzprobleme'
		});
		dialog.show();
		dialog.addEventListener('click', function() {
			self.close();
		});
	}
	var label = Ti.UI.createLabel({
		font : {
			fontWeight : 'bold',
			fontSize : 24
		},
		color : '#444',
		bottom : 10,
		left : 10,
		right : 10,
		textAlign : 'center',
		height : Ti.UI.SIZE,
		text : 'Wähle Deine Rolle!'
	});
	var left = Ti.UI.createView({
		width : '50%',
		itemId : 'q',
		bottom : 30,
		left : 0
	});
	var right = Ti.UI.createView({
		width : '50%',
		itemId : 'a',
		right : 0,
		bottom : 30
	});

	var container = Ti.UI.createView({
		backgroundImage : '/assets/logo.png'
	});
	self.add(container);
	self.add(left);
	self.add(right);
	self.add(label);
	var keyboard;
	setTimeout(function() {
		left.addEventListener('click', onClick);
		right.addEventListener('click', onClick);
		keyboard = require('ui/keyboard.widget').create();
		keyboard.addEventListener('OK', function(_res) {
			require('ui/' + type).create(color, _res.room).open();
		});
		self.add(keyboard);
	}, 1000);
	return (Ti.Android) ? self : navwin;
};
