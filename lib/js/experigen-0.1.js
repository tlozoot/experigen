Array.prototype.subset = function (field, criterion) {
	var arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] === criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.exclude = function (field, criterion) {
	var arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] !== criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.excludeBlock = function (excludeArray) {
	var newArray = [];
	for (var i=0; i<this.length; i++) {
		var found = false;
		for (var j=0; j<excludeArray.length; j++) {
			if (this[i]===excludeArray[j]) {
				found = true;
			} else {
				if(Experigen && Experigen.resources && Experigen.resources.items && this[i][Experigen.resources.items.key]===excludeArray[j][Experigen.resources.items.key]) {
					found = true;
				}
			}
		}
		if (!found) {
			newArray.push(this[i]);
		}
	}
	return newArray;
}



Array.prototype.chooseFirst = function (i) {
		if (!i) {
			return this.slice(0,1);
		} else {
			return this.slice(0,i);
		}
}

Array.prototype.excludeFirst = function (i) {
		if (!i) {
			return this.slice(1,this.length);
		} else {
			return this.slice(i,this.length);
		}
}


Array.prototype.chooseRandom = function (i) {
	var arr = this;
	return arr.shuffle().chooseFirst(i);
}


Array.prototype.pairWith = function (field, arr) {

	if (!arr) { console.error("Can't pair with empty list!"); return false; }
	if (typeof arr === "string") { arr = [arr];}

	/// clone this
	var newArray = [];
	for (var i=0; i<this.length; i+=1) {
		newArray.push(jQuery.extend(true, {}, this[i]));
	}

	var arrPosition = 0;
	for (var i=0 ; i<newArray.length ; i++) {
		newArray[i][field] = arr[arrPosition];
		arrPosition++;
		if(arrPosition>=arr.length) arrPosition=0;
	}
	if (Experigen) { 
		Experigen.fieldsToSave[field] = true; 
	}
	return newArray;
}



Array.prototype.shuffle = function () {
	var arr  = new Array();
	for (var i=0 ; i<this.length ; i++) {
		arr.push(this[i]);
	}
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}


Array.prototype.uniqueNonEmpty = function () {
	
	var noempties = true;
	var hash = {};
	for (var i=0 ; i<this.length ; i++) {
		if (!this[i] || this[i]=="") {
			noempties = false;
		} else {
			hash[this[i]] = "1";
		}
	}
	var hashlength=0;
	for (i in hash) {hashlength++};
	return (this.length===hashlength && noempties);
}

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
	

	that.advance = function() {
		if (Experigen.getCurrentScreen().callingPart===0) { // initial call
			Experigen.getCurrentScreen().parts = $(".trialpartWrapper");
			var haveIDs = true; // check that all wrappers have ID's
			// to do: check that they are "part" + number w/o skipping
			for (var i=0; i<Experigen.getCurrentScreen().parts.length; i++) {
				if(!Experigen.getCurrentScreen().parts[i].id) haveIDs = false;
			}
			if (!haveIDs) { // assign IDs by order
				console.log("This template doesn't full specify part numbers, parts will appear in order");
				for (var i=0; i<Experigen.getCurrentScreen().parts.length; i++) {
					Experigen.getCurrentScreen().parts[i].id = "part" + (i+1);
				}
			}
		}
		if (Experigen.getCurrentScreen().callingPart===Experigen.getCurrentScreen().currentPart) {
			Experigen.getCurrentScreen().currentPart += 1;
			$("#" + "part" + Experigen.getCurrentScreen().currentPart).show();
		}
	}

	
	that.makeScale = function(obj) {
		Experigen.getCurrentScreen().responses++;
		var direction = obj.direction || that.VERTICAL;
		var buttons = obj.buttons || ["1","2","3","4","5","6","7"];
		var edgelabels = obj.edgelabels || [''];
		var sidelabels = obj.sidelabels || [''];
		var edgelabel_position = 0;
		var sidelabel_position = 0;

		var serverValues = obj.serverValues || buttons;
		/// validate serverValues here to be non-empty and distinct

		var str = "";
		str += '<div class="scaleWrapper' + direction + '">';
		str += '<div class="scaleEdgeLabel' + direction + '">' + edgelabels[edgelabel_position] + '</div>';
		edgelabel_position += 1; 
		if(edgelabel_position>=edgelabels.length)  edgelabel_position=0;

		for (var i=0; i<buttons.length; i+=1) {

			if (direction===that.VERTICAL) {
				str += '<div class="scalebuttonWrapper' + direction + '">';
			} else {
				str += '<div class="scalebuttonWrapper' + direction + '">';
			}
			
			str += '<input type="button" value=" '+ buttons[i] +' " id="' + Experigen.getCurrentScreen().responses + 'button' + i + '" class="scaleButton' + direction + '" onClick="Experigen.getCurrentScreen().recordResponse(' + Experigen.getCurrentScreen().responses + "," + "'" + buttons[i] + "'" + ');Experigen.advance();">';
			str += '<div class="scalebuttonsidelabel' + direction + '">' + sidelabels[sidelabel_position] + '</div>';

			str += '</div>';

			sidelabel_position+= 1;  
			if(sidelabel_position >=sidelabels.length)  sidelabel_position=0;
		}

		str += '<div class="scaleEdgeLabel' + direction + '">' + edgelabels[edgelabel_position] + '</div>';
		str += '</div>';
		str += "<input type='hidden' name='response" + Experigen.getCurrentScreen().responses + "' value=''>\n";
		return str;
	}

	that.recordResponse = function (scaleNo, buttonNo) {
		/// make all the necessary fields in document.forms["currentform"],
		/// and fill them with data
		document.forms["currentform"]["response"+scaleNo].value = buttonNo;
		for (i in Experigen.fieldsToSave) {
			var str = "";
			//console.log(i + ": " + typeof Experigen.getCurrentScreen()[i]);
			if (typeof Experigen.getCurrentScreen()[i] === "object") {
				str = "<input type='hidden' name='" + i + "' value='" + Experigen.getCurrentScreen()[i][Experigen.resources[i+"s"].key] + "'>"; 
			} else {
				str = "<input type='hidden' name='" + i + "' value='" + Experigen.getCurrentScreen()[i] + "'>"; 
			}
			$("#currentform").append(str);
		}
		for (var i=0; i<Experigen.getCurrentScreen().soundbuttons.length; i+=1) {
			var str= "<input type='hidden' name='sound" + (i+1) + "' value='" + Experigen.getCurrentScreen().soundbuttons[i].presses + "'>\n";
			$("#currentform").append(str);
		}
		Experigen.sendForm($("#currentform"));
	}


	that.playSound = function (soundID, caller) {
		var comingFrom = $(caller).parent(".trialpartWrapper").attr("id").match(/part(\d+)$/)[1];
		Experigen.getCurrentScreen().callingPart = parseInt(comingFrom,10);
		soundManager.play(soundID);
		for (i=0; i<Experigen.getCurrentScreen().soundbuttons.length; i+=1) {
			if (Experigen.getCurrentScreen().soundbuttons[i].id === soundID) {
				Experigen.getCurrentScreen().soundbuttons[i].presses += 1;
			}
		}
	}
	
	that.makeSoundButton = function (obj) {

		if (typeof obj==="string") {
			obj = {soundFile: "data/sounds/" + obj}
		}
		var label = obj.label || Experigen.settings.strings.soundButton;
		var soundID  = obj.soundID || Experigen.screen()[Experigen.resources.items.key] + Experigen.screen().trialnumber + Experigen.screen().soundbuttons.length;
		var soundFile = obj.soundFile;
		Experigen.getCurrentScreen().soundbuttons.push({id: soundID, presses: 0, file: soundFile});
		
		soundManager.createSound({
			id: soundID,
			url: soundFile,
			autoPlay: false, 
			autoLoad: true,
			onload:function() {
			},
			onfinish:function() {
				Experigen.getCurrentScreen().advance();
			}
		});

		var str = "";
		str += '<input type="button" ';
		str += ' id="' + soundID +'"';
		str += ' value="' + label + '"';
		str += ' onClick="Experigen.getCurrentScreen().playSound(\'' + soundID + '\',this);"'
		str += ' style="margin-left: 10px;"'
		str += '>';
		return str;
	}

	return that;
}



// connection to local text files and to the database

Experigen.loadUserID = function () {
	var that = this;
	var jsonp_url = this.settings.databaseServer + "getuserid.cgi?experimentName=" + this.settings.experimentName ;
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
}

Experigen.sendForm = function (formObj) {
	//console.debug(formObj.serialize());
	var jsonp_url = this.settings.databaseServer + "dbwrite.cgi?" + formObj.serialize();
	$.ajax({
		dataType: 'jsonp',
		url: jsonp_url,  
		success: function (data) {
			console.debug(data);
			return true;
		}
	});
}

Experigen.loadText = function (spec) {
	var url = spec.url;
	var wait = spec.wait;
	var destination = spec.destination;
	
	$.ajax({
		url: url,
		success: function (data) {
			$("#footer").html(data);
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
			var lines = data.split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
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
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
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


Experigen.launch();