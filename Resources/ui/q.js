exports.create = function(_color, _room) {
	Ti.App.Cligga.joinRoom('Q_' + Ti.App.Cligga.getRoomId(), function(_payload) {
	});
	Ti.App.Cligga.addEventListener('voters', function(_payload) {
		console.log(JSON.stringify(_payload));
		member.setText(_payload.voters + ' Teilnehmer');
	});
	var self = Ti.UI.createWindow({
		navBarHidden : true,
		fullscreen : true,
		backgroundColor : _color
	});
	var member = Ti.UI.createLabel({
		bottom : 5,
		color : 'silver',
		height : 50,
		font : {
			fontWeight : 'bold',
			fontSize : 18
		},
		text : 'noch kein Antworter angemeldet'
	});
	self.add(member);

	self.add(Ti.UI.createLabel({
		height : 50,
		color : 'silver',
		top : 0,
		font : {
			fontWeight : 'bold',
			fontSize : 24
		},
		text : 'Frageraum: #' + _room
	}));
	var views = [];
	views[0] = Ti.UI.createTableView({
		top : 50,
		left : 5,
		right : 5,
		bottom : 50,
		backgroundColor : 'white'
	});
	var scroller = Ti.UI.createScrollableView({
		views : views,
		top : 50,
		bottom : 50,
		scrollingEnabled : false
	});
	self.add(scroller);
	var questions = require('model/questions');

	var data = [];
	for (var i = 0; i < questions.length; i++) {
		var row = Ti.UI.createTableViewRow({
			itemId : JSON.stringify(questions[i]),
			hasDetails : true,
			borderWidth : 1,
			height : Ti.UI.SIZE,
			borderColor : 'silver',
		});
		row.add(Ti.UI.createView({
			width : 30,
			height : 30,
			right : 5,

			backgroundImage : '/assets/redarrow.png'
		}));
		row.add(Ti.UI.createLabel({
			color : '#444',
			left : 10,
			top : 5,
			height : Ti.UI.SIZE,
			bottom : 5,
			text : questions[i].q,
			top : 10,
			bottom : 10,
			left : 10,
			right : 50,
			font : {
				fontWeight : 'bold',
				fontSize : 24
			},
		}));
		data.push(row);
	}
	views[0].setData(data);
	views[0].addEventListener('click', function(_e) {
		views[1] = require('ui/question').create(_e.row.itemId);
		scroller.views = views;
		scroller.scrollToView(1);
		scroller.scrollingEnabled = true;
	});
	scroller.addEventListener('scrollend', function() {
		if (scroller.currentPage == 0) {
			Ti.App.Cligga.sendQuestion({
				type : null
			});
		}
	});
	return self;
};
