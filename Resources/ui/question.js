exports.create = function(_question) {
	var question = JSON.parse(_question);
	var self = Ti.UI.createView();
	var container = Ti.UI.createScrollView({
		top : 5,
		scrollType : 'vertical',
		left : 5,
		right : 5,
		bottom : 50,
		backgroundColor : 'white'
	});
	container.add(Ti.UI.createLabel({
		top : 10,
		left : 10,
		right : 10,
		color : '#333',
		font : {
			fontWeight : 'bold',
			fontSize : 24
		},
		text : question.q
	}));
	self.button = Ti.UI.createButton({
		height : 40,
		width : '90%',
		title : 'Frage senden!',bottom:5,
	});
	self.button.addEventListener('click',function(){
		Ti.App.Cligga.sendQuestion(question);
	});
	self.add(self.button);
	self.add(container);
	return self;
};
