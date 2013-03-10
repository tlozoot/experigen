/*  
//future encapuslation
Experigen = function () {

	var settings = Experigen.settings;
	var initialize = Experigen.initialize;

	return {
		settings: settings,
		initialize: initialize
	}
}(); */



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
Experigen.initialized = false;

if (Experigen.settings.online===undefined) {
	Experigen.settings.online = true; // set to true for old settings files
}

Experigen.launch = function () {
	var that = this;
	$(document).ready(function(){
		$('body').append('<div id="mainwrapper"><div id="main">' + that.settings.strings.connecting + '</div></div><div id="footer"></div>');
		that.loadUserID();		

		// prepare to catch the return key when 
		// the participant is typing in a textbox
		// (which would naturally be focused)
		$.expr[':'].focus = function(a){ return (a == document.activeElement); }
		$(document).keydown(function(event) {
			if ($(".:focus") && $(".:focus").attr("type")) {
				if ($(".:focus").attr("type")==="text" && event.keyCode===13) {
					event.preventDefault();
					$(".:focus").change();
					if (Experigen.screen()) {
						Experigen.screen().findCaller($(".:focus"));
						var spec = {};
						if (/textInputDisable/.test($(".:focus").attr("class"))) {
							spec.disable = true;
						}
						Experigen.screen().advance(spec);
					}
				}
			}
		});

	});
}

Experigen.load = function () {

	var that = this;
	$("#main").html(this.settings.strings.loading);
	$(document).attr("title",this.settings.strings.windowTitle);

	this.resources["items"] = this.loadResource(this.settings.items);
	this.fieldsToSave[this.resources.items.key] = true;
	this.fieldsToSave["trialnumber"] = true;

	for (var resource in this.settings.otherresources) {
		this.resources[resource] = this.loadResource(this.settings.otherresources[resource]); 
	}

	this.loadText({destination: "#footer", url: this.settings.footer, wait: true});

	this.progressbar = this.new_progressbar();
	this.progressbar.initialize();

	if (this.settings.audio) {

		soundManager.onready(function() { 
			if (!that.initialized) {
				that.initialize();
				that.initialized = true;
				that.advance();
			}
		});

	} else {
		this.initialize();
		this.initialized = true;
		this.advance();
	}
}


Experigen.advance = function(callerButton) {

	var that = this;
	var html = "";
	
	var prefix = "<form id='currentform' onSubmit='return false;'>" 
			   + "<input type='hidden' name='userCode' value='" + this.userCode + "'>"
			   + "<input type='hidden' name='userFileName' value='" + this.userFileName + "'>"
			   + "<input type='hidden' name='experimentName' value='" + this.settings.experimentName + "'>"
			   + "<input type='hidden' name='sourceurl' value='" + encodeURIComponent(window.location) + "'>";
			   

	var suffix = "</form>";

	if (callerButton) callerButton.disabled = true;
	this.position++;
	this.progressbar.advance(); 
	
	var screen = this.screen();
	this.make_into_trial(screen);

	switch (screen.screentype) {
		case this.STATIC:
			
			var fileType = screen.url.match(/\.[a-zA-Z]+$/);
			if (fileType) { fileType = fileType[0]; };
			switch (fileType) {
			
				case ".html":
					$.get(screen.url, function(data) {
						$("#main").html(prefix + data + suffix);
						$("#main").find(':input[type!="hidden"]').first().focus();
					});
					screen.advance();
					break;
				
				case ".ejs":
					html = new EJS({url: screen.url}).render(screen);
					$("#main").html(prefix + html + suffix);
					$("#main").find(':input[type!="hidden"]').first().focus();
					screen.advance();
					break;

				default:
					$("#main").html(this.settings.strings.errorMessage);
			
			}
			break;
			
		case this.TRIAL:
			if (screen.view) {
				html = new EJS({url: this.settings.folders.views + screen.view}).render(screen);
				$("#main").html(prefix + html + suffix);
				screen.advance();
			} else {
				$("#main").html(this.settings.strings.errorMessage);
			}
			break;
		default:
			$("#main").html(this.settings.strings.errorMessage);
	}
	// hide local interface
	if (screen.trialnumber===2) {
		if ($("#localStorageAccess")) {
			$("#localStorageAccess").hide();
		}
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

Experigen.resource = function (rname) {
	if (this.resources && this.resources[rname]) {
		return this.resources[rname].table;
	}
}

Experigen.addStaticScreen = function (obj) {

	if (typeof obj=="string") {
		obj = {url: this.settings.folders.views + obj};	
	}
	obj.screentype = this.STATIC;
	obj.trialnumber = this._screens.length+1;
	this._screens.push(obj);	

	return this;
}

Experigen.screen = function () {
	return this._screens[this.position];
}

Experigen.printScreensToConsole = function () {
	for (var i=0; i<this._screens.length; i++) {
		console.log(this._screens[i]);
	}
}

Experigen.recordResponse = function (callerbutton) {
	this.sendForm($("#currentform"));
	this.advance(callerbutton);
}


Experigen.new_progressbar = function () {
	
	var adjust = this.settings.progressbar.adjustWidth || 4;
	var visible = this.settings.progressbar.visible;
	var percentage = this.settings.progressbar.percentage;
	var that = this;

	return { 
		initialize : function() {
			if (visible) {
				$("#progressbar").html('<div id="progress_bar_empty"><img scr="_lib/js/spacer.gif" width="1" height="1" alt="" border=0></div><div id="progress_bar_full"><img scr="_lib/js/spacer.gif" width="1" height="1" alt="" border=0></div><div id="progress_text">&nbsp;</div>');
				this.advance();
			}
		},
		advance : function () {
			if (visible) {
				$("#progress_bar_empty").width((that._screens.length-(that.position+1))*adjust +  "px");
				$("#progress_bar_full").width((that.position+1)*adjust + "px");
				if (percentage) {
					$("#progress_text").html( Math.floor(100*(that.position+1)/that._screens.length) + "%");
				} else {
					$("#progress_text").html((that.position+1) + "/" + that._screens.length);
				}
			}
		}
	}
};


Experigen.manageLocalData = function () {

	var html = '<div id="localStorageAccess" style="position:absolute; bottom: 0px; left: 0px; cursor:pointer;" onClick="$(\'#localStorageInterface\').toggle()">O</div>';
	$('body').append(html);

	html = '<div id="localStorageInterface" style="display:none; background: white; margin: 30px auto; padding: 30px; width: 500px; position:relative;">'
		+ '<input type="button" style="margin: 30px;" value="I am on a laptop, send the data on this computer to the server" onClick="Experigen.synchLocalData()"><br>'
		+ '<input type="button" style="margin: 30px;" value="I am on an iDevice, email me the data" onClick="Experigen.emailLocalData()" disabled=true><br>'
		+ '<input type="button" style="margin: 30px;" value="erase the data on this computer" onClick="if(confirm(\'Are you sure? No undo!\')) Experigen.eraseLocalData();">'
		+ '<div style="position:absolute; top:0px;right:2px;cursor:pointer;" onClick="$(\'#localStorageInterface\').toggle()">X</div>'
		+ '</div>';

	$('body').append(html);

};

Experigen.synchLocalData = function () {
	var data = $.totalStorage(Experigen.settings.experimentName);
	for (var i=0; i<data.length; i=i+1) {
		this.sendForm(data[i]);
	}
};

Experigen.emailLocalData = function () {

};

Experigen.eraseLocalData = function () {
	$.totalStorage(Experigen.settings.experimentName,'');
};





