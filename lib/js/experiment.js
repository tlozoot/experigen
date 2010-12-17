Experigen._screens = [];
Experigen.STATIC = "instructions";
Experigen.TRIAL = "trial";
Experigen.VERSION = "0.1";
Experigen.audio = false;
Experigen.userFileName = "";
Experigen.userCode = "";
Experigen.fieldsToSave = {};
Experigen.resources = [];
Experigen.position = -1;

Experigen.launch = function () {
	var that = this;
	$(document).ready(function(){
		$('body').append('<div id="main"></div><div id="footer"></div>');
		that.loadUserID();		
	});
}

Experigen.load = function () {

	var that = this;
	$("#main").html(this.settings.strings.loading);

	this.resources["items"] = this.loadResource("data/items.txt");
	this.fieldsToSave[this.resources.items.key] = true;
	this.fieldsToSave["trialnumber"] = true;

	this.resources["frames"] = this.loadResource("data/frames.txt"); 
	this.resources["pictures"] = this.loadResource("data/pictures.txt"); 

	this.loadText({destination: "#footer", url: "app/templates/footer.html", wait: true});

	this.progressbar.initialize();

	if (this.settings.audio) {
		soundManager.onload = function() { 
			that.initialize(); 
			that.advance();
		};
	} else {
		this.initialize();
		this.advance();
	}
}


Experigen.advance = function(callerButton) {

	var that = this;
	
	var prefix = "<form id='currentform'>" 
			   + "<input type='hidden' name='userCode' value='" + this.getUserCode() + "'>"
			   + "<input type='hidden' name='userFileName' value='" + this.getUserFileName() + "'>"
			   + "<input type='hidden' name='experimentName' value='" + this.settings.experimentName + "'>";

	var suffix = "</form>";

	if (callerButton) callerButton.disabled = true;
	this.position++;
	this.progressbar.advance(); 
	
	var screen = this.getCurrentScreen();
	switch (screen.screentype) {
		case this.STATIC:
			
			var fileType = screen.url.match(/\.[a-zA-Z]+$/);
			if (fileType) { fileType = fileType[0]; };
			switch (fileType) {
			
				case ".html":
					$.get(screen.url, function(data) {
						$("#main").html(prefix + data + suffix);
					});
					break;
				
				case ".ejs":
					html = new EJS({url: screen.url}).render({});
					$("#main").html(prefix + html + suffix);
					break;

				default:
					$("#main").html(this.settings.strings.errorMessage);
			
			}
			break;
			
		case this.TRIAL:
			//console.log(screen);
			this.make_into_trial(screen);
			if (screen.view) {
				html = new EJS({url: 'app/templates/' + screen.view}).render({});
				$("#main").html(prefix + html + suffix);
				screen.advance();
			} else {
				html = new EJS({url: 'app/templates/missingview.ejs'}).render({});
				$("#main").html(prefix + html + suffix);
			}
			break;
		default:
			$("#main").html(this.settings.strings.errorMessage);
	}

}


Experigen.addBlock = function (arr) {
	for (var i=0 ; i<arr.length ; i++) {
		arr[i].trialnumber = this._screens.length+1;
		arr[i].screentype = this.TRIAL;
		this._screens.push(arr[i]);	
	}
	return this;
}

Experigen.getFrameSentences = function () {
	return this.resources.frames.table;
}
Experigen.getPictures = function () {
	return this.resources.pictures.table;
}

Experigen.addStaticScreen = function (obj) {

	if (typeof obj=="string") {
		obj = {url: "app/templates/" + obj};	
	}
	obj.screentype = this.STATIC;
	obj.trialnumber = this._screens.length+1;
	this._screens.push(obj);	

	return this;
}
Experigen.getCurrentScreen = function () {
	return this._screens[this.position];
}
Experigen.screen = function () {
	return this._screens[this.position];
}
Experigen.printScreensToConsole = function () {
	for (var i=0; i<this._screens.length; i++) {
		console.log(this._screens[i]);
	}
}
Experigen.setUser = function (data) {
	this.userFileName = data[0];
	this.userCode = data[1];
}
Experigen.getUserCode = function() {
	return this.userCode;
}
Experigen.getUserFileName = function() {
	return this.userFileName;
}

Experigen.getItems = function() {
	return this.resources.items.table;
}

Experigen.recordResponse = function (callerbutton) {
	this.sendForm($("#currentform"));
	this.advance(callerbutton);
}


Experigen.progressbar = {
	
	 adjust : Experigen.settings.progressbar.adjustWidth || 4,
	 visible : Experigen.settings.progressbar.visible,
	 percentage : Experigen.settings.progressbar.percentage,

	 initialize : function() {
		if (Experigen.progressbar.visible) {
			$("#progressbar").html('<DIV ID="progress_bar_empty"></DIV><DIV ID="progress_bar_full"></DIV><DIV ID="progress_text"></DIV>');
			Experigen.progressbar.advance();
		}
	},
	 advance : function () {
		if (Experigen.progressbar.visible) {
			$("#progress_bar_empty").width((Experigen._screens.length-(Experigen.position+1))*Experigen.progressbar.adjust +  "px");
			$("#progress_bar_full").width((Experigen.position+1)*Experigen.progressbar.adjust + "px");
			if (Experigen.progressbar.percentage) {
				$("#progress_text").html( Math.floor(100*(Experigen.position+1)/Experigen._screens.length) + "%");
			} else {
				$("#progress_text").html((Experigen.position+1) + "/" + Experigen._screens.length);
			}
		}
	}
	
}

Experigen.makeContinueButton = function () {
	return '<input type="button" value="' + this.settings.strings.continueButton + '" onClick="Experigen.advance(this);">'
}
	



