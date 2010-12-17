
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



