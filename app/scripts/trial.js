
function Trial(screen) {

	this.screen = screen || {};
	this.screen.uniquekey = exp.getCurrentScreen().item; /// to be implemented

	this.screen.HORIZONTAL = 1;
	this.screen.VERTICAL = 2;
	
	this.screen.singular = (this.screen.finalConsonant=="l") ? this.screen.item : this.screen.item_j;

	this.screen.base1 = "";
	this.screen.base2 = "";

	this.screen.deriv1 = "data/sounds/" + exp.getCurrentScreen()["file_" + this.screen.finalConsonant];
	this.screen.deriv2 = "data/sounds/" + exp.getCurrentScreen()["file_pl_" + this.screen.finalConsonant];

	this.screen.position = 0;
	this.screen.advance = function() {
		$("#" + exp.getCurrentScreen().item + 'trialpart' + exp.getCurrentScreen().position).show();
		exp.getCurrentScreen().position++;
	}
	
	this.screen.makeScale = function(obj) {
		var direction = obj.direction || Trial.VERTICAL;
		var buttons = obj.buttons || ["1","2","3","4","5","6","7"];
		var labels = obj.labels || [""];
		var serverValues = obj.serverValues || buttons;
		var labelposition = 0;
		
		var str = "";
		for (var i=0; i<buttons.length; i++) {
			str += '<div><input type="button" value=" '+ buttons[i] +' " id="' + exp.getCurrentScreen().item + 'button' + i + '" style="margin-right: 10px;" onClick="exp.advance();">';
			str += labels[labelposition];
			labelposition++;
			if(labelposition>=labels.length) labelposition=0;
			str += '</div>';
		}
		return str;
	}
	
	this.screen.makeSoundButton = function (obj) {
		var label = obj.label || "    ►    ";
		var soundID  = obj.soundID || exp.getCurrentScreen().uniquekey + 'pl1button';
		var soundFile = obj.soundFile;

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

		str = "";
		str += '<input type="button" ';
		str += ' id="' + soundID +'"';
		str += ' value="' + label + '"';
		str += ' onClick="soundManager.play(\'' + soundID + '\');"'
		str += ' style="margin-left: 10px;"'
		str += '>';
		return str;
	}


	this.html = function() {
	
		var str = "";

		var f1 = this.screen.frame.text.replace(/_+/, "<b><i>" +  this.screen.singular + "</i></b>");
		f1 += exp.getCurrentScreen().makeSoundButton({soundFile: exp.getCurrentScreen().deriv1, soundID: exp.getCurrentScreen().uniquekey + 'pl1button'});

		var f2 = this.screen.frame.text.replace(/_+/, "<b><i>" +  this.screen.singular + "</i></b>");
		f2 += exp.getCurrentScreen().makeSoundButton({soundFile: exp.getCurrentScreen().deriv2, soundID: exp.getCurrentScreen().uniquekey + 'pl2button'});

		if (exp.getCurrentScreen().rand == "x-first") {
			[f1 ,f2] = [f2 ,f1];
		}



		str += '<div id="' + exp.getCurrentScreen().item + 'trialpart0' + '" style="text-align:center; display:none;">';
		str += f1;
		str += '</div>';
		str += '<script>';
		str += "$('#' + exp.getCurrentScreen().item + 'pl1button').click(function(){ soundManager.play(exp.getCurrentScreen().deriv1); });"; 
		str += '</script>';

		
		str += '<table border=0 style="height: 30ex; width: 100%; padding: 10px 0px 10px 0px"><tr><td style="vertical-align: middle;">'
		str += '<div id="' + exp.getCurrentScreen().item + 'trialpart2' + '" style="margin-left: 50%; display: none;">';
		str += exp.getCurrentScreen().makeScale({buttons: ["1","2","3","4","5","6","7"], direction: Trial.HORIZONTAL, labels: ['⬆ I prefer the first plural','','','No preference','','','⬇ I prefer the second plural']}); //
		str += '</div>'
		str += '</td></tr></table>'


		str += '<div id="' + exp.getCurrentScreen().item + 'trialpart1' + '" style="display: none; text-align:center;">';
		str += f2;
		str += '</div>';
		str += '<script>';
		str += "$('#' + exp.getCurrentScreen().item + 'pl2button').click(function(){ soundManager.play(exp.getCurrentScreen().deriv2); });"; 
		str += '</script>';
		
		return str;
	}

}