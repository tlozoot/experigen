
function Experiment() {

	this.STATIC = 1;
	this.TRIAL = 2;
	this.VERSION = "0.1";

	this.userFileName = "";
	this.userCode = "";

	this.fieldsToSave = {};

	this.screens = [];
	this.items = [];

	this.resources = [];
	
	this.position = -1;
	this.progressbar;
	this.audio = false;

	this.load = function () {
		var that = this;

		$("#main").html("Loading...");
		this.loadUserID();
		this.loadItems();

		this.resources.frames = this.loadResource("frames"); 
		this.resources.pictures = this.loadResource("pictures"); 
		
		$.ajax({
			url: CONFIG.proxyURL + "app/templates/footer.html",
			success: function (data) {
				$("#footer").html(data);
				return true;
			},
			async: false,
			error: function() {
				console.error("Error! Footer not found.");
				return false;
			}
		});
		
		
		if (this.hasAudio()) {
			soundManager.onload = function() { that.initialize(); };
		} else {
			this.initialize();
		}
	}


	this.advance = function(callerButton) {

		var that = this;

		if (callerButton) callerButton.disabled = true;
		this.position++;
		if (this.progressbar) this.progressbar.advance(); 
		
		var screen = this.getCurrentScreen();
		switch (screen.screentype) {
			case this.STATIC:
				$.get(CONFIG.proxyURL + screen.url, function(data) {
					var str = "";
					str += "<form id='currentform'>";
					str += "<input type='hidden' name='userCode' value='" + that.getUserCode() + "'>"; 
					str += "<input type='hidden' name='userFileName' value='" + that.getUserFileName() + "'>"; 
					str += data;
					str += "</form>";
					$("#main").html(str);
				});
				break;
				
			case this.TRIAL:
			
				trial = new Trial(screen);
				
				if (screen.view) {
					html = new EJS({url: CONFIG.proxyURL + 'app/templates/' + screen.view}).render({});
					$("#main").html("<form id='currentform'>" + html + "</form>");
					screen.advance();
				} else {
					html = new EJS({url: CONFIG.proxyURL + 'lib/missingview.ejs'}).render({});
					$("#main").html("<form id='currentform'>" + html + "</form>");
				}
				break;
			default:
				$("#main").html("An error occurred. Please contact system administrator.");
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
		return this.resources.frames.table;
	}
	this.getPictures = function () {
		return this.resources.pictures.table;
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
	this.getUserFileName = function() {
		return this.userFileName;
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
		var status = 0;
		if (this.userFileName.length<1) status = "missing file name!";
		if (this.userCode.length<4) status = "Couldn't get user ID!";		
		return status;
	}

	this.recordResponse = function (callerbutton) {
		this.sendForm($("#currentform"));
		this.advance(callerbutton);
	}

}