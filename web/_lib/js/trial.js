
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



