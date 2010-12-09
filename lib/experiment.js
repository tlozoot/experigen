
function Experiment() {

	this.STATIC = 1;
	this.TRIAL = 2;
	this.VERSION = "0.1";

	this.userFileName = "";
	this.userCode = "";

	this.fieldsToSave = {};
	this.frameKey = "";

	this.screens = new Array();
	this.items = new Array();
	this.frames = new Array();

	this.position = -1;
	this.progressbar;
	this.audio = false;

	this.load = function () {
		$("#main").html("Loading...");
		this.loadUserID();
		this.loadFrameSentences();
		this.loadItems();
		if (this.hasAudio()) {
			e = this;
			soundManager.onload = function() { e.initialize(); };
		} else {
			this.initialize();
		}
	}


	this.advance = function(callerButton) {

		if (callerButton) callerButton.disabled = true;
		this.position++;
		if (this.progressbar) this.progressbar.advance(); 
		
		var screen = this.getCurrentScreen();
		switch (screen.screentype) {
			case this.STATIC:
			
				$.get(CONFIG.proxyURL + screen.url, function(data) {
					$("#main").html("<form id='currentform'>" + data + "</form>");
				});
				break;
				
			case this.TRIAL:
			
				trial = new Trial(screen);
				
				if (screen.view) {
					html = new EJS({url: CONFIG.proxyURL + 'app/templates/' + screen.view}).render({});
					$("#main").html("<form id='currentform'>" + html + "</form>");
					//new EJS({url: CONFIG.proxyURL + 'app/templates/' + screen.view}).update( $("#main")[0] , {});
					screen.advance();
					//$("#main").html(trial.html());
					//this.getCurrentScreen().advance();
				} else {
					html = new EJS({url: CONFIG.proxyURL + 'lib/missingview.ejs'}).render({});
					$("#main").html("<form id='currentform'>" + html + "</form>");
					//new EJS({url: CONFIG.proxyURL + 'lib/missingview.ejs'}).update( $("#main")[0] , {});
				}
				break;
			default:
				$("#main").html("Error occurred. Please contact system administrator.");
		}

	}


	this.addBlock = function (arr) {
		for (var i=0 ; i<arr.length ; i++) {
			arr[i].trialnumber = this.screens.length+1;
			this.screens.push(arr[i]);	
		}
		return this;
	}

	this.getFrameSentences = function () {
		return this.frames;
	}

	this.setProgressBar = function (obj) {
		this.progressbar = obj;
		this.progressbar.length = this.screens.length;
		this.progressbar.position = this.position+1;
		this.progressbar.initialize();
		return this;
	}

	this.addStaticScreen = function (obj) {
	
		if (typeof obj=="string") {
			obj = {url: "app/templates/" + obj};	
		}
		obj.screentype = this.STATIC;
		obj.trialnumber = this.screens.length+1;
		this.screens.push(obj);	

		return this;
	}
	this.getCurrentScreen = function () {
		return this.screens[this.position];
	}
	this.setUser = function (data) {
		this.userFileName = data[0];
		this.userCode = data[1];
	}
	this.getUserCode = function() {
		return this.userCode;
	}
	this.hasAudio = function(bool) {
		if (bool==null) {
			return this.audio;
		} else {
			this.audio = (bool==true) ? true : false;
			return this.audio;
		}
	}
	this.getItems = function() {
		return this.items;
	}
	this.getStatus = function () {
		status = 0;
		if (this.userFileName.length<1) status = "missing file name!";
		if (this.userCode.length<4) status = "Couldn't get user ID!";		
		return status;
	}


}