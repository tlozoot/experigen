
function Trial(screen) {

	this.screen = screen || {};
	this.screen.userCode = exp.userCode;
	this.screen.userFileName = exp.userFileName;

	this.screen.HORIZONTAL = "H";
	this.screen.VERTICAL = "V";

	this.screen.parts = new Array();
	this.screen.currentPart = 0;
	this.screen.callingPart = 0;
	this.screen.soundbuttons = new Array();
	this.screen.responses = 0;
	

	this.screen.advance = function() {
		if (exp.getCurrentScreen().callingPart===0) { // initial call
			exp.getCurrentScreen().parts = $(".trialpartWrapper");
			var haveIDs = true; // check that all wrappers have ID's
			// to do: check that they are "part" + number w/o skipping
			for (var i=0; i<exp.getCurrentScreen().parts.length; i++) {
				if(!exp.getCurrentScreen().parts[i].id) haveIDs = false;
			}
			if (!haveIDs) { // assign IDs by order
				console.log("This template doesn't full specify part numbers, parts will appear in order");
				for (var i=0; i<exp.getCurrentScreen().parts.length; i++) {
					exp.getCurrentScreen().parts[i].id = "part" + (i+1);
				}
			}
		}
		if (exp.getCurrentScreen().callingPart===exp.getCurrentScreen().currentPart) {
			exp.getCurrentScreen().currentPart += 1;
			$("#" + "part" + exp.getCurrentScreen().currentPart).show();
		}
	}

	
	this.screen.makeScale = function(obj) {
		exp.getCurrentScreen().responses++;
		var direction = obj.direction || Trial.VERTICAL;
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

			if (direction===Trial.VERTICAL) {
				str += '<div class="scalebuttonWrapper' + direction + '">';
			} else {
				str += '<div class="scalebuttonWrapper' + direction + '">';
			}
			
			str += '<input type="button" value=" '+ buttons[i] +' " id="' + exp.getCurrentScreen().responses + 'button' + i + '" class="scaleButton' + direction + '" onClick="exp.getCurrentScreen().recordResponse(' + exp.getCurrentScreen().responses + "," + "'" + buttons[i] + "'" + ');exp.advance();">';
			str += '<div class="scalebuttonsidelabel' + direction + '">' + sidelabels[sidelabel_position] + '</div>';

			str += '</div>';

			sidelabel_position+= 1;  
			if(sidelabel_position >=sidelabels.length)  sidelabel_position=0;
		}

		str += '<div class="scaleEdgeLabel' + direction + '">' + edgelabels[edgelabel_position] + '</div>';
		str += '</div>';
		str += "<input type='hidden' name='response" + exp.getCurrentScreen().responses + "' value=''>\n";
		return str;
	}

	this.screen.recordResponse = function (scaleNo, buttonNo) {
		/// make all the necessary fields in document.forms["currentform"],
		/// and fill them with data
		document.forms["currentform"]["response"+scaleNo].value = buttonNo;
		for (i in exp.fieldsToSave) {
			var str = "";
			//console.log(i + ": " + typeof exp.getCurrentScreen()[i]);
			if (typeof exp.getCurrentScreen()[i] === "object") {
				str = "<input type='hidden' name='" + i + "' value='" + exp.getCurrentScreen()[i][exp.resources[i+"s"].key] + "'>"; 
			} else {
				str = "<input type='hidden' name='" + i + "' value='" + exp.getCurrentScreen()[i] + "'>"; 
			}
			$("#currentform").append(str);
		}
		for (var i=0; i<exp.getCurrentScreen().soundbuttons.length; i+=1) {
			var str= "<input type='hidden' name='sound" + (i+1) + "' value='" + exp.getCurrentScreen().soundbuttons[i].presses + "'>\n";
			$("#currentform").append(str);
		}
		exp.sendForm($("#currentform"));
	}


	this.screen.playSound = function (soundID, caller) {
		var comingFrom = $(caller).parent(".trialpartWrapper").attr("id").match(/part(\d+)$/)[1];
		exp.getCurrentScreen().callingPart = parseInt(comingFrom,10);
		soundManager.play(soundID);
		for (i=0; i<exp.getCurrentScreen().soundbuttons.length; i+=1) {
			if (exp.getCurrentScreen().soundbuttons[i].id === soundID) {
				exp.getCurrentScreen().soundbuttons[i].presses++;
			}
		}
	}
	
	this.screen.makeSoundButton = function (obj) {
	
		if (typeof obj==="string") {
			obj = {soundFile: "data/sounds/" + obj}
		}
		var label = obj.label || "    ►    ";
		var soundID  = obj.soundID || exp.getCurrentScreen().item + exp.getCurrentScreen().soundbuttons.length;
		var soundFile = CONFIG.proxyURL + obj.soundFile;
		exp.getCurrentScreen().soundbuttons.push({id: soundID, presses: 0});
		
		soundManager.createSound({
			id: soundID,
			url: soundFile,
			autoPlay: false, 
			autoLoad: true,
			onload:function() {
			},
			onfinish:function() {
				exp.getCurrentScreen().advance();
			}
		});

		var str = "";
		str += '<input type="button" ';
		str += ' id="' + soundID +'"';
		str += ' value="' + label + '"';
		str += ' onClick="exp.getCurrentScreen().playSound(\'' + soundID + '\',this);"'
		str += ' style="margin-left: 10px;"'
		str += '>';
		return str;
	}

}