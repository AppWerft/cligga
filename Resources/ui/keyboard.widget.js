exports.create = function(_args, _callbacks) {
	var NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '<', 0, 'OK'], buttons = [];
	var self = Ti.UI.createView({
		bottom : -240,  
		height : 240,
		backgroundColor : '#222'
	});
	self.hiddendisplay = Ti.UI.createLabel({
		top : 0,
		font : {
			fontSize : 32,
			fontWeight : 'bold'
		},
		height : 50
	});
	self.add(self.hiddendisplay);
	self.keyboardcontainer = Ti.UI.createView({
		top : 50,
		layout : 'horizontal'
	});
	for (var i = 0; i < NUMBERS.length; i++) {
		buttons.push(Ti.UI.createLabel({
			color : 'white',
			textAlign : 'center',
			borderWidth : 1,
			borderColor : '#333',
			height : 48,
			font : {
				fontWeight : 'bold',
				fontSize : 32
			},
			text : NUMBERS[i],
			width : '33%'
		}));
		self.keyboardcontainer.add(buttons[i]);
	}
	self.keyboardcontainer.addEventListener('click', function(_e) {
		if (_e.source.text != '<' && _e.source.text != 'OK') {
			self.hiddendisplay.setText(self.hiddendisplay.getText() + _e.source.text);
			if (self.hiddendisplay.getText().length == 12) {
				self.animate({
					bottom : -300
				});
				var spinner = Ti.UI.createActivityIndicator({
					color : 'white',
					backgroundColor : 'black',
					font : {
						fontFamily : 'Helvetica Neue',
						fontSize : 16
					},
					message : 'Login into ANZ … ',
					opacity : 0.8,
					style : Ti.UI.ActivityIndicatorStyle.BIG,
					height : Ti.UI.SIZE,
					width : Ti.UI.SIZE
				});
				spinner.show();
				self.add(spinner);
				setTimeout(function() {
					spinner.hide();
					_callbacks.onsuccess();
				}, 700);
			}
		} else if (_e.source.text == 'OK') {
			self.fireEvent('OK', {
				room : self.hiddendisplay.getText()
			});
		} else {
			self.hiddendisplay.setText('');
		}
	});
	self.add(self.keyboardcontainer);
	return self;
};
