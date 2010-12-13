
function Experiment() {

	this._screens = [];

	this.STATIC = 1;
	this.TRIAL = 2;
	this.VERSION = "0.1";
	this.audio = false;

	this.userFileName = "";
	this.userCode = "";

	this.fieldsToSave = {};

	this.resources = [];
	
	this.position = -1;
	
	if (!this.settings) {
		this.settings = {};
		if (!this.settings.strings) {
			this.settings.strings = {};
			alert("!!!");
		}
		if (!this.settings.progressbar) {
			this.settings.progressbar = {};
			alert("!!!");
		}
	}

	this.load = function () {

		var that = this;
		$("#main").html(this.settings.strings.loading);

		this.loadUserID();
		
		this.resources["items"] = this.loadResource("data/items.txt");
		this.fieldsToSave["item"] = true;
		this.fieldsToSave["trialnumber"] = true;

		this.resources["frames"] = this.loadResource("data/frames.txt"); 
		this.resources["pictures"] = this.loadResource("data/pictures.txt"); 

		this.loadText({destination: "#footer", url: CONFIG.proxyURL + "app/templates/footer.html", wait: true});

		this.progressbarContainer.initialize();

		if (this.settings.audio) {
			soundManager.onload = function() { 
				that.initialize(); 
			};
		} else {
			this.initialize();
		}
	}


	this.advance = function(callerButton) {

		var that = this;
		
		var prefix = "<form id='currentform'>" 
				   + "<input type='hidden' name='userCode' value='" + this.getUserCode() + "'>"
				   + "<input type='hidden' name='userFileName' value='" + this.getUserFileName() + "'>";

		var suffix = "</form>";

		if (callerButton) callerButton.disabled = true;
		this.position++;
		this.progressbarContainer.advance(); 
		
		var screen = this.getCurrentScreen();
		switch (screen.screentype) {
			case this.STATIC:
				
				var fileType = screen.url.match(/\.[a-zA-Z]+$/);
				if (fileType) { fileType = fileType[0]; };
				switch (fileType) {
				
					case ".html":
						$.get(CONFIG.proxyURL + screen.url, function(data) {
							$("#main").html(prefix + data + suffix);
						});
						break;
					
					case ".ejs":
						html = new EJS({url: CONFIG.proxyURL + screen.url}).render({});
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
					html = new EJS({url: CONFIG.proxyURL + 'app/templates/' + screen.view}).render({});
					$("#main").html(prefix + html + suffix);
					screen.advance();
				} else {
					html = new EJS({url: CONFIG.proxyURL + 'lib/missingview.ejs'}).render({});
					$("#main").html(prefix + html + suffix);
				}
				break;
			default:
				$("#main").html(this.settings.strings.errorMessage);
		}

	}


	this.addBlock = function (arr) {
		for (var i=0 ; i<arr.length ; i++) {
			arr[i].trialnumber = this._screens.length+1;
			arr[i].screentype = this.TRIAL;
			this._screens.push(arr[i]);	
		}
		return this;
	}

	this.getFrameSentences = function () {
		return this.resources.frames.table;
	}
	this.getPictures = function () {
		return this.resources.pictures.table;
	}

	this.addStaticScreen = function (obj) {
	
		if (typeof obj=="string") {
			obj = {url: "app/templates/" + obj};	
		}
		obj.screentype = this.STATIC;
		obj.trialnumber = this._screens.length+1;
		this._screens.push(obj);	

		return this;
	}
	this.getCurrentScreen = function () {
		return this._screens[this.position];
	}
	this.screen = function () {
		return this._screens[this.position];
	}
	this.printScreensToConsole = function () {
		for (var i=0; i<this._screens.length; i++) {
			console.log(this._screens[i]);
		}
	}
	this.setUser = function (data) {
		this.userFileName = data[0];
		this.userCode = data[1];
	}
	this.getUserCode = function() {
		return this.userCode;
	}
	this.getUserFileName = function() {
		return this.userFileName;
	}

	this.getItems = function() {
		return this.resources.items.table;
	}

	this.recordResponse = function (callerbutton) {
		this.sendForm($("#currentform"));
		this.advance(callerbutton);
	}


	this.progressbarContainer = {
		adjust: this.settings.progressbar.adjustWidth || 4,
		visible: this.settings.progressbar.visible,
		percentage: this.settings.progressbar.percentage,
		initialize: function() {
			if (exp.progressbarContainer.visible) {
				$("#progressbar").html('<DIV ID="progress_bar_empty"></DIV><DIV ID="progress_bar_full"></DIV><DIV ID="progress_text"></DIV>');
				exp.progressbarContainer.advance();
			}
		},
		advance: function () {
			if (exp.progressbarContainer.visible) {
				$("#progress_bar_empty").width((exp._screens.length-(exp.position+1))*exp.progressbarContainer.adjust +  "px");
				$("#progress_bar_full").width((exp.position+1)*exp.progressbarContainer.adjust + "px");
				if (exp.progressbarContainer.percentage) {
					$("#progress_text").html( Math.floor(100*(exp.position+1)/exp._screens.length) + "%");
				} else {
					$("#progress_text").html((exp.position+1) + "/" + exp._screens.length);
				}
			}
		}
	}

	this.makeContinueButton = function () {
		return '<input type="button" value="' + this.settings.strings.continueButton + '" onClick="exp.advance(this);">'
	}
	


}