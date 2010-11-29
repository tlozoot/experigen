
function Experiment() {

	var STATIC = 1;
	var TRIAL = 2;

	this.userFileName = "";
	this.userCode = "";

	this.screens = new Array();
	this.items = new Array();
	this.blocks;

	this.position = -1;
	this.progressbar;
	this.hasAudio = false;

	this.advance = function(callerButton) {

		if (callerButton) callerButton.disabled = true;
		this.position++;
		if (this.progressbar) this.progressbar.advance(); 
		
		var screen = this.getCurrentScreen();
		switch (screen.screentype) {
			case STATIC:
			
				$.get(screen.url, function(data) {
					$("#main").html(data);
				});
				break;
				
			case TRIAL:
			
				trial = new Trial(screen);
				$("#main").html(trial.html());
				break;
				
			default:
				$("#main").html("Error occurred. Please contact system administrator.");
		}

	}

	this.makeBlocks = function() {
	
	}
	this.addBlock = function (arr) {
		for (var i=0 ; i<arr.length ; i++) {
			this.screens.push(arr[i]);	
		}
	}
	this.getBlock = function (i) {
		return this.items;
	}


	this.setProgressBar = function (obj) {
		this.progressbar = obj;
		this.progressbar.length = this.screens.length;
		this.progressbar.position = this.position+1;
		this.progressbar.initialize();
	}

	this.addStaticScreen = function (obj) {
		obj.screentype=STATIC;
		this.screens.push(obj);	
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
	this.setAudio = function (b) {		
		this.hasAudio = (b==true)? true : false;
	}
	this.getAudio = function() {
		return this.hasAudio;
	}
	this.setItems = function (arr) {
		this.items = arr;
		for (var i=0; i<this.items.length; i++) {
			if(!this.items[i].screentype) {
				this.items[i].screentype = TRIAL;
			}
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