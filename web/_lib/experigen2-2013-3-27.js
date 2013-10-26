// nothing to edit here; this file was created by deploy.pl





//printing the content of js/trial.js

;
Experigen.make_into_trial = function (that) {

	that.userCode = Experigen.userCode;
	that.userFileName = Experigen.userFileName;

	that.HORIZONTAL = "H";
	that.VERTICAL = "V";

	that.parts = [];
	that.currentPart = 0;
	that.callingPart = 0;
	that.soundbuttons = [];
	that.responses = 0;
	

	that.advance = function(spec) {
		var parts = $(".trialpartWrapper");
		var part = "";
		var spec = spec || {};
		// initial call figures out screen parts
		if (parts.length && Experigen.screen().callingPart===0) { 
			Experigen.screen().parts = $(".trialpartWrapper");
			var haveIDs = true; // check that all wrappers have ID's
			// to do: check that they are "part" + number w/o skipping
			for (var i=0; i<Experigen.screen().parts.length; i++) {
				if(!Experigen.screen().parts[i].id) haveIDs = false;
			}
			if (!haveIDs) { // assign IDs by order
				//console.log("This template doesn't fully specify part numbers, parts will appear in order");
				for (var i=0; i<Experigen.screen().parts.length; i++) {
					Experigen.screen().parts[i].id = "part" + (i+1);
				}
			}
		}
		// after initalization:
		if (parts.length && Experigen.screen().callingPart===Experigen.screen().currentPart) {
			// current part
			part = "#" + "part" + Experigen.screen().currentPart;
			// does it contain text boxes that shouldn't allowed to be empty?
			if (/textInputNotEmpty/.test($(part).find(':input').first().attr("class")) && !Experigen.screen().checkEmpty($(part).find(':input').first())) {
				return false;
			} else {
				// no text boxes to fill, we can move on
				// hide current part first if needed
				if (spec && spec.hide) {
					$(part).hide();
				}
				if (spec && spec.disable) {
					// let's disable any form elements
					$(part + ' input[type!="hidden"]').attr("disabled", "disabled");
				}
				// now advance and show next part, or advance to next screen
				Experigen.screen().currentPart += 1;
				if (Experigen.screen().currentPart > Experigen.screen().parts.length) {
					
					// add all require data to the current form
					for (i in Experigen.fieldsToSave) {
						var str = "";
						//console.log(i + ": " + typeof Experigen.screen()[i]);
						if (typeof Experigen.screen()[i] === "object") {
							str = "<input type='hidden' name='" + i + "' value='" + Experigen.screen()[i][Experigen.resources[i+"s"].key] + "'>"; 
						} else {
							str = "<input type='hidden' name='" + i + "' value='" + Experigen.screen()[i] + "'>"; 
						}
						$("#currentform").append(str);
					}
					for (var i=0; i<Experigen.screen().soundbuttons.length; i+=1) {
						var str= "<input type='hidden' name='sound" + (i+1) + "' value='" + Experigen.screen().soundbuttons[i].presses + "'>\n";
						$("#currentform").append(str);
					}
					// send the form
					// enable all text fields before sending, because disabled elements will not be sent
					$("#currentform " + 'input[type="text"]').prop("disabled",false)
					Experigen.sendForm($("#currentform"));
					Experigen.advance();
				} else {
					// show next part
					part = "#" + "part" + Experigen.screen().currentPart;
					$(part).show();
					// give focus to the first form object inside, if any
					$(part).find(':input[type!="hidden"][class!="scaleButton"]').first().focus();
				}
			}
		}
		return true;
	}

	
	that.makeScale = function(obj) {
		Experigen.screen().responses++;
		var buttons = obj.buttons || ["1","2","3","4","5","6","7"];
		var edgelabels = obj.edgelabels || [''];
		var linebreaks = obj.linebreaks || 0;
		var buttontype = "button";
		if (obj.buttontype === "radio") { buttontype = "radio"; };
		var disable = (obj.disable) ? true  : false;
		var hide    = (obj.hide) ? true  : false;

		var serverValues = obj.serverValues || buttons;
		/// validate serverValues here to be non-empty and distinct

		var str = "";
		str += '<div class="scaleWrapper">';
		str += '<div class="scaleEdgeLabel">' + edgelabels[0] + '</div>';
		for (var i=0; i<buttons.length; i+=1) {
			str += '<div class="scalebuttonWrapper">';
			str += '<input type="' + buttontype + '" value="'+ buttons[i] +'" id="' + Experigen.screen().responses + 'button' + i + '" name="scale'+ Experigen.screen().responses +'" class="scaleButton" onClick="Experigen.screen().recordResponse(' + Experigen.screen().responses + "," + "'" + buttons[i] + "'" + ');Experigen.screen().continueButtonClick(this,{hide:' +  hide + ',disable:' + disable + '});';

			if (obj.rightAnswer) {
				str += 'Experigen.screen().feedbackOnText(this,\'' + obj.feedbackID + '\',\'' + obj.matchRegExpression + '\',\'' + obj.rightAnswer + '\',\'' + obj.feedbackWrong + '\',\'' + obj.feedbackMatch + '\',\'' + obj.feedbackRight + '\')';
			}

			str += '"></div>';
			if (linebreaks>0 && (i+1)%linebreaks==0 && (i+1)!=buttons.length) { str += '<br>'}
		}
		str += '<div class="scaleEdgeLabel">' + edgelabels[edgelabels.length-1] + '</div>';
		str += '</div>';
		str += "<input type='hidden' name='response" + Experigen.screen().responses + "' value=''>\n";
		return str;
	}

	that.recordResponse = function (scaleNo, buttonNo) {
		/// make all the necessary fields in document.forms["currentform"],
		/// and fill them with data
		if (scaleNo!==undefined && buttonNo!==undefined) {
			document.forms["currentform"]["response"+scaleNo].value = buttonNo;
		}
	}


	that.playSound = function (soundID, caller) {
		// play the sound
		soundManager.play(soundID);
		for (i=0; i<Experigen.screen().soundbuttons.length; i+=1) {
			if (Experigen.screen().soundbuttons[i].id === soundID) {
				Experigen.screen().soundbuttons[i].presses += 1;
			}
		}
		// find who called it, so the screen can advance 
		// when the sound is done playing
		Experigen.screen().findCaller(caller);
	}

	that.findCaller = function (caller) {
		// determine which trialpartWrapper the came from
		var comingFrom = $(caller);
		while (comingFrom && comingFrom.parent().length===1) {
			if (comingFrom.parent(".trialpartWrapper").length===1) {
				comingFrom = comingFrom.parent();
				break;
			}
			comingFrom = comingFrom.parent();
			if (comingFrom.attr("id")==="main") {
				break;
			}
		}
		if (comingFrom && comingFrom.attr("id")) {
			var part = comingFrom.attr("id").match(/part(\d+)$/);
			if (part) part = part[1];
			Experigen.screen().callingPart = parseInt(part,10);
		}
		return comingFrom;
	}

	
	that.makeTextInput = function (obj) {

		Experigen.screen().responses++;
	
		if (typeof obj==="string") {
			obj = {initValue: obj}
		}
		if (typeof obj!=="object") {
			obj = {initValue: ""}
		}
		if (!obj.initValue) {
			obj.initValue = "";
		}
		var str = "";
		str += "<input type='text' name='response" + Experigen.screen().responses + "' ";
		str += "id=response" + Experigen.screen().responses + " ";
		str += "value='"+ obj.initValue + "' ";

		var classNames = [];
		if (obj.allowempty===false) {
			classNames.push("textInputNotEmpty");
		} else {
			classNames.push("textInput");
		}
		if (obj.disable===true) {
			classNames.push("textInputDisable");
		}
		str += "class='" + classNames.join(" ") + "' ";
		
		if (obj.style) {
			str += "style='" + obj.style + "' ";
		}
		if (obj.onclick) {
			str += "onclick='" + obj.onclick + "' ";
		}
		if (obj.onblur) {
			str += "onblur='" + obj.onblur + "' ";
		}
		if (obj.onfocus) {
			str += "onfocus='" + obj.onfocus + "' ";
		}
		if (obj.onchange) {
			str += "onchange='" + obj.onchange + "' ";
		}
		if (obj.matchRegExpression || obj.rightAnswer) {
			var temp = 'Experigen.screen().feedbackOnText(this,"' + obj.feedbackID + '","' + obj.matchRegExpression + '","' + obj.rightAnswer + '","' + obj.feedbackWrong + '","' + obj.feedbackMatch + '","' + obj.feedbackRight + '")';
			str += "onchange='" + temp + "' ";
		}
		str += ">\n";
		return str;
	}





	that.feedbackOnText = function (sourceElement, targetElement, regex, rightAnswer, feedbackWrong, feedbackMatch, feedbackRight) {
		var str = $(sourceElement)[0].value || "";
		str = str.trim();
		var patt;
		if (str===rightAnswer) {
			$(targetElement).html(feedbackRight.replace(/RIGHTANSWER/,'"' + rightAnswer + '"'));
		} else {
			if (str && !feedbackMatch) { // supply feedback only to non-empty answers
				$(targetElement).html(feedbackWrong.replace(/RIGHTANSWER/,'"' + rightAnswer + '"'));
				return true;
			}
			patt = new RegExp(regex,"i");
			if (patt.test(str)) {
				$(targetElement).html(feedbackMatch.replace(/RIGHTANSWER/,'"' + rightAnswer + '"'));
			} else {
				if (str) { // supply feedback only to non-empty answers
					$(targetElement).html(feedbackWrong.replace(/RIGHTANSWER/,'"' + rightAnswer + '"'));
				}
			}
		}
	}


	that.makePicture = function (obj) {
	
		if (typeof obj==="string") {
			obj = {src: obj}
		}
		if (typeof obj!=="object") {
			obj = {src: ""}
		}
		if (!obj.initValue) {
			obj.scr = "";
		}
		obj.src = Experigen.settings.folders.pictures + obj.src;
	
		var str = "";
		str += "<img ";
		if (obj.src) {
			str += "src='" + obj.src + "' ";
		}
		if (obj.width) {
			str += "width='" + obj.width + "' ";
		}
		if (obj.height) {
			str += "height='" + obj.height + "' ";
		}
		if (obj.alt) {
			str += "alt='" + obj.alt + "' ";
		}
		if (obj["class"]) {
			str += "class='" + obj["class"] + "' ";
		}
		if (obj.id) {
			str += "id='" + obj.id + "' ";
		}
		if (obj.style) {
			str += "style='" + obj.style + "' ";
		}
		if (obj.onclick) {
			str += "onclick='" + obj.onclick + "' ";
		}
		if (obj.onblur) {
			str += "onblur='" + obj.onblur + "' ";
		}
		if (obj.onfocus) {
			str += "onfocus='" + obj.onfocus + "' ";
		}
		if (obj.onchange) {
			str += "onchange='" + obj.onchange + "' ";
		}
		str += ">";
		return str;	
	}

	
	that.checkEmpty = function (obj) {

		if ($(obj).val().match(/^\s*$/)) {
			$(obj).val("");
			alert(Experigen.settings.strings.emptyBoxMessage);
			$(obj).focus();
			return false;
		} else {
			return true;
		}
	}


	that.continueButton = function (obj) {

		var str = ""

		if (typeof obj==="string") {
			obj = {label: obj}
		}
		if (!obj) {
			obj = {};
		}
		if (!obj.label) {
			obj.label = Experigen.settings.strings.continueButton;
		}

		str += '<input type="button" value="' + obj.label + '" ';
		var spec = [];
		if (obj.hide===true) {
			spec.push("hide:true");
		}
		if (obj.disable===true) {
			spec.push("disable:true");
		}
		spec = spec.length ? ",{" + spec.join(",") + "}" : "";		
		str += 'onClick="Experigen.screen().continueButtonClick(this' + spec + ');">'
		return str
	}

	that.continueButtonClick = function (caller, spec) {

		var comingFrom = Experigen.screen().findCaller(caller);
		if (comingFrom && comingFrom.attr("class")==="trialpartWrapper") {
			Experigen.screen().advance(spec);
		} else {
			Experigen.advance(caller);
		}
	
	}


	
	that.makeSoundButton = function (obj) {

		if (typeof obj==="string") {
			obj = {soundFile: obj}
		}
		var label = obj.label || Experigen.settings.strings.soundButton;
		var soundID  = obj.soundID || (Experigen.screen()[Experigen.resources.items.key]||"") + Experigen.screen().trialnumber + Experigen.screen().soundbuttons.length;
		soundID = "_" + soundID; // force all sounds to start with a non-numeric character
		var soundFile = Experigen.settings.folders.sounds + obj.soundFile;
		var advance = true;
		if (obj.advance===false) {
			advance = false;
		}
		Experigen.screen().soundbuttons.push({id: soundID, presses: 0, file: soundFile});
		
		var soundFile2 = "";
		if (obj.soundFile2) {
			soundFile2 = Experigen.settings.folders.sounds + obj.soundFile2;
		}
		var soundID2  = soundID + "_2";
		
		soundManager.createSound({
			id: soundID,
			url: soundFile,
			autoPlay: false, 
			autoLoad: true,
			onfinish:function() {
				if (advance) {
					if (soundFile2 === "") {
						Experigen.screen().advance();
					} else {
						soundManager.play(soundID2);
					}
				}
			}
		});
		if (soundFile2 != "") {
			soundManager.createSound({
				id: soundID2,
				url: soundFile2,
				autoPlay: false, 
				autoLoad: true,
				onfinish:function() {
					if (advance) {
						Experigen.screen().advance();
					}
				}
			});
		}
		var str = "";
		str += '<input type="button" ';
		str += ' id="' + soundID +'"';
		str += ' value="' + label + '"';
		str += ' onClick="Experigen.screen().playSound(\'' + soundID + '\',this);"'
		str += ' class="soundbutton"'
		str += '>';
		return str;
	}

	return that;
}






//printing the content of js/dataconnection.js

;// connection to local text files and to the database

Experigen.loadUserID = function () {
	var that = this;
	var jsonp_url = this.settings.databaseServer + "getuserid.cgi?experimentName=" + this.settings.experimentName  + "&sourceurl=" + encodeURIComponent(window.location);
	
	if (this.settings.online) {
		// online mode: connect to the database server
		$.ajax({
			dataType: 'jsonp',
			url: jsonp_url,  
			success: function (data) {
				that.userFileName = data;
				var code =  String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26));
				that.userCode = code + that.userFileName;	
				
				that.load();
				//console.debug(data);
			}
		});

	} else {
		// offline mode

		// find device name
		if (!$.totalStorage('deviceName')) {
			var name =  String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26));
			$.totalStorage('deviceName',name);
		}
		// find record of last file name, add 1 to that
		if (!$.totalStorage('fileName')){
			$.totalStorage('fileName', {});
		}
		var fileName = $.totalStorage('fileName');
		if (fileName && !fileName[this.settings.experimentName]) {
			fileName[this.settings.experimentName] = 0;
			$.totalStorage('fileName',fileName);
		} 
		fileName[this.settings.experimentName] += 1;
		$.totalStorage('fileName',fileName);
		this.userFileName = $.totalStorage('fileName')[this.settings.experimentName];
		var code =  String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26));
		this.userCode = code + this.userFileName;	
		this.load();
		// create interface for managing local data
		this.manageLocalData();
	}
}



Experigen.sendForm = function (formObj) {
	
	if (this.settings.online) {
		// online mode	
		var jsonp_url = this.settings.databaseServer + "dbwrite.cgi?" + formObj.serialize();
		$.ajax({
			dataType: 'jsonp',
			url: jsonp_url,  
			success: function (data) {
				//console.debug(data);
				return true;
			}
		});

	} else {
	
		//offline mode --- write locally if object, send to server if string
		if (typeof formObj==="string") {
			
			var jsonp_url = this.settings.databaseServer + "dbwrite.cgi?" + formObj;
			$.ajax({
				dataType: 'jsonp',
				url: jsonp_url,  
				success: function (data) {
					//console.debug(data);
					return true;
				}
			});
			
		} else {
			formObj.append('<input type="hidden" name="deviceName" value="' + $.totalStorage('deviceName') + '">');
			formObj.append('<input type="hidden" name="localTime" value="' + Date().toString() + '">');
			var experiment = $.totalStorage(this.settings.experimentName) || [];
			experiment.push(formObj.serialize());
			$.totalStorage(this.settings.experimentName, experiment);
		}

	}
}




Experigen.loadText = function (spec) {
	var url = spec.url;
	var wait = spec.wait;
	var destination = spec.destination;
	
	$.ajax({
		url: url,
		success: function (data) {
			$(destination).html(data);
		},
		async: !wait,
		error: function() {
			console.error("Error! Footer not found.");
		}
	});
}


Experigen.loadResource = function (name) {

	var key = "";
	var items = [];
	
	$.ajax({
		url: name,
		success: function(data) {
			var lines = data.split(/[\n\r]/);
			var fields = lines[0].replace(/\s+$/, '').split("\t");
			key = fields[0]; // for now, the "key" for a tab-delimited file is always the first before the file's first tab
			if (!fields.uniqueNonEmpty()) {
				console.error("Field names in " + name + " must be unique and non-empty!");
				return false;
			}
			var keys = []; // these are saved to be evaluated by uniqueNonEmpty()
			LINE: for (var i=1; i<lines.length; i++) {
				if (lines[i].match(/^\s*$/)) {
					continue LINE;
				}
				var line = lines[i].replace(/\s+$/, '').split("\t");
				keys.push(line[0]);
				var frame = {};
				for (var j=0; j<line.length; j++) {
					frame[ fields[j] ] = line[j];
				}
				//console.log(frame);
				items.push(frame);
			}
			if(!keys.uniqueNonEmpty()) {
				console.error("In " + name + ", the values of the first column must be unique and non-empty!");
				return false;
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("The file " + name + " wasn't found.");
			return false;
		}
	});
	
	return {table: items, key: key};
}





//printing the content of js/experiment.js

;/*  
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








//printing the content of js/launch.js

;//var exp = new Experiment();
Experigen.launch();