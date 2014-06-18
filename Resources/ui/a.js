exports.create = function(_color, _room) {
	var win = Ti.UI.createWindow({
		navBarHidden : true,
		fullscreen : true,
		backgroundColor : _color,

	});
	var container = Ti.UI.createScrollView({
		top : 10,
		left : 10,
		right : 10,
		bottom : 10,
		layout : 'vertical',
		backgroundColor : 'white'
	});
	win.add(container);
	Ti.App.Cligga.joinvoter(function(_payload) {
		if (_payload.type == null) {
			container.removeAllChildren();
		}
		if (_payload.type == 'mc') {
			Ti.Media.vibrate();
			container.removeAllChildren();
			container.add(Ti.UI.createLabel({
				text : _payload.q,
				color : '#333',
				top : 10,
				left : 10,
				right : 10,
				height : Ti.UI.SIZE,
				font : {
					fontWeight : 'bold',
					fontSize : 24
				},
			}));
			var answers = [];
		}
		if (_payload.type == 'imageclick') {
			Ti.Media.vibrate();
			container.removeAllChildren();
			container.add(Ti.UI.createLabel({
				text : _payload.q,
				color : '#333',
				top : 10,
				left : 10,
				right : 10,
				height : Ti.UI.SIZE,
				font : {
					fontWeight : 'bold',
					fontSize : 24
				},
			}));
			container.add(Ti.UI.createLabel({
				text : _payload.text,
				color : '#333',
				top : 10,
				left : 10,
				right : 10,
				height : Ti.UI.SIZE,
				font : {
					fontSize : 18
				},
			}));
			container.add(Ti.UI.createImageView({
				top : 10,
				width : Ti.UI.FILL,
				image : _payload.url
			}));
			var answers = [];
		}
	});
	return win;
};
