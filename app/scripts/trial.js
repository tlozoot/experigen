
function Trial(screen) {

	this.screen = screen || {};
	this.screen.uniquekey = exp.getCurrentScreen().item + Math.floor(Math.random()*1000000); /// to be improved?

	this.screen.HORIZONTAL = 1;
	this.screen.VERTICAL = 2;

	this.screen.parts = new Array();
	this.screen.currentPart = -1;
	this.screen.callingPart = -1;
	this.screen.soundbuttons = new Array();
	this.screen.responses = 0;
	
	this.screen.htmlStr = "";

	
	this.screen.makeScale = function(obj) {
		var direction = obj.direction || Trial.VERTICAL;
		var buttons = obj.buttons || ["1","2","3","4","5","6","7"];
		var leftlabels = obj.leftlabels || ['&nbsp;'];
		var rightlabels = obj.rightlabels || ['&nbsp;'];
		var leftlabelposition = 0;
		var rightlabelposition = 0;

		var serverValues = obj.serverValues || buttons;
		/// validate serverValues here to be non-empty and distinct

		var str = "";
		str += '<div class="scaleWrapper">';
		for (var i=0; i<buttons.length; i++) {

			if (direction==Trial.VERTICAL) {
				str += '<div class="scalebuttonWrapperVertical">';
			} else {
				str += '<div class="scalebuttonWrapperHorizontal">';
			}
			
			str += '<div class="scalebuttonleftlabel">' + leftlabels[leftlabelposition] + '</div>';
			str += '<input type="button" value=" '+ buttons[i] +' " id="' + exp.getCurrentScreen().uniquekey + 'button' + i + '" class="scaleButton" onClick="exp.getCurrentScreen().recordResponse(' + exp.getCurrentScreen().responses + "," + "'" + buttons[i] + "'" + ');exp.advance();">';
			str += '<div class="scalebuttonrightlabel">' + rightlabels[rightlabelposition] + '</div>';

			str += '</div>';

			leftlabelposition++;  if(leftlabelposition >=leftlabels.length)  leftlabelposition=0;
			rightlabelposition++; if(rightlabelposition>=rightlabels.length) rightlabelposition=0;
		}
		str += '</div>';
		str += "<input type='hidden' name='response" + exp.getCurrentScreen().responses + "' value=''>\n";
		return str;
	}

	this.screen.recordResponse = function (scaleNo, buttonNo) {
		document.forms[exp.getCurrentScreen().uniquekey + "form"]["response"+scaleNo].value = buttonNo;
		for (var i=0; i<exp.getCurrentScreen().soundbuttons.length; i++) {
			document.forms[exp.getCurrentScreen().uniquekey + "form"]["sound"+i].value = exp.getCurrentScreen().soundbuttons[i].presses;
		}
		exp.sendForm(document.forms[exp.getCurrentScreen().uniquekey + "form"]);
	}


	this.screen.advance = function() {
		if (exp.getCurrentScreen().callingPart==exp.getCurrentScreen().currentPart) {
			exp.getCurrentScreen().currentPart++;
			$("#" + exp.getCurrentScreen().uniquekey + 'part' + exp.getCurrentScreen().currentPart).show();
		}
	}

	this.screen.playSound = function (soundID, caller) {
		var comingFrom = $(caller).parent(".trialpartWrapper").attr("id").match(/part(\d+)$/)[1];
		exp.getCurrentScreen().callingPart = comingFrom;
		soundManager.play(soundID);
		for (i=0; i<exp.getCurrentScreen().soundbuttons.length; i++) {
			if (exp.getCurrentScreen().soundbuttons[i].id == soundID) {
				exp.getCurrentScreen().soundbuttons[i].presses++;
			}
		}
	}
	
	this.screen.makeSoundButton = function (obj) {
		var label = obj.label || "    ►    ";
		var soundID  = obj.soundID || exp.getCurrentScreen().uniquekey + exp.getCurrentScreen().soundbuttons.length;
		var soundFile = obj.soundFile;
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
	
	
	
	this.screen.makePart = function (content) {
		content = content || "";
		var str ="";
		str += '<div id="' + exp.getCurrentScreen().uniquekey + 'part' + exp.getCurrentScreen().parts.length + '" class="trialpartWrapper">';
		str += content;
		str += '</div>';
		exp.getCurrentScreen().parts.push(str);		
		return str; //exp.getCurrentScreen().parts.push(str);
	}
	

	this.screen.addPart = function (str) {
		exp.getCurrentScreen().htmlStr += str;
	}
	
	this.screen.save = function(obj) {
		var str = "";
		str += "<form action='' name='" + exp.getCurrentScreen().uniquekey + "form" + "' id='" + exp.getCurrentScreen().uniquekey + "form" + "'>\n";
		str += "<input type='hidden' name='userCode' value='" + exp.getUserCode() + "'>\n";
		for (i=0; i<exp.getCurrentScreen().soundbuttons.length; i++) {
			str += "<input type='hidden' name='sound" + i + "' value='0'>\n";
		}
		for (var i in obj) {
			str += "<input type='hidden' name='" + i + "' value='" + obj[i] + "'>\n";
		}
		str += exp.getCurrentScreen().htmlStr;
		str += "</form>";
		exp.getCurrentScreen().htmlStr = str;
	}


	this.html = function() {


		exp.getCurrentScreen().singular = (exp.getCurrentScreen().finalConsonant=="l") ? exp.getCurrentScreen().item : exp.getCurrentScreen().item_j;

		var sound_pl1 = CONFIG.proxyURL + "data/sounds/" + exp.getCurrentScreen()["file_" + exp.getCurrentScreen().finalConsonant];
		var f1 = exp.getCurrentScreen().frame.text.replace(/_+/, "<b><i>" +  exp.getCurrentScreen().singular + "</i></b>");
		f1 += exp.getCurrentScreen().makeSoundButton({soundFile: sound_pl1});

		var sound_pl2 = "data/sounds/" + exp.getCurrentScreen()["file_pl_" + exp.getCurrentScreen().finalConsonant];
		var f2 = exp.getCurrentScreen().frame.text.replace(/_+/, "<b><i>" +  exp.getCurrentScreen().singular + "</i></b>");
		f2 += exp.getCurrentScreen().makeSoundButton({soundFile: sound_pl2});
		
		if (exp.getCurrentScreen().rand == "x-first") {
			var temp = f1;
			f1 = f2; 
			f2 = temp;
		}

		var part1 = exp.getCurrentScreen().makePart(f1);
		var part2 = exp.getCurrentScreen().makePart(f2);


		//var scale = exp.getCurrentScreen().makeScale({direction: exp.getCurrentScreen().HORIZONTAL, buttons: ["1","2","3","4","5","6","7"], rightlabels: ['⬆ I prefer the first plural','','','No preference','','','⬇ I prefer the second plural'], leftlabels:['&nbsp;']});
		var scale = exp.getCurrentScreen().makeScale({direction: exp.getCurrentScreen().HORIZONTAL, buttons: ["1","2","3","4","5","6","7"], leftlabels:['Good','','','','','',''], rightlabels: ['','','','','','','Bad']});
		var part3 = exp.getCurrentScreen().makePart(scale);

		
		exp.getCurrentScreen().addPart(part1);
		exp.getCurrentScreen().addPart(part3);
		exp.getCurrentScreen().addPart(part2);
		
		exp.getCurrentScreen().save({
			"item" : exp.getCurrentScreen().item, 
			"final": exp.getCurrentScreen().finalConsonant,
			"frame": exp.getCurrentScreen().frame.id,
			"rand" : exp.getCurrentScreen().rand
		});
		
		
		return exp.getCurrentScreen().htmlStr;
	}

}