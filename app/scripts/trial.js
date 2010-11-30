
function Trial(screen) {

	this.screen = screen || {};

	this.screen.base1 = "";
	this.screen.base2 = "";
	this.screen.deriv1 = "data/sounds/" + exp.getCurrentScreen().file_l;
	this.screen.deriv2 = "data/sounds/" + exp.getCurrentScreen().file_pl_l;


	soundManager.createSound({
		id: exp.getCurrentScreen().deriv1,
		url: exp.getCurrentScreen().deriv1,
		autoPlay: false, 
		autoLoad: true,
		onload:function() {
		},
		onfinish:function() {
			$("#" + exp.getCurrentScreen().item + 'secondhalf').show();
		}
	});
	soundManager.createSound({
		id: exp.getCurrentScreen().deriv2,
		url: exp.getCurrentScreen().deriv2,
		autoPlay: false, 
		autoLoad: true,
		onload:function() {
		},
		onfinish:function() {
			$("#" + exp.getCurrentScreen().item + 'response_buttons').show();
			$("#" + exp.getCurrentScreen().continuebutton).show();
		}
	});


	this.addEvents = function () {
	
		$("#" + exp.getCurrentScreen().item + 'pl1button').click(function(){ soundManager.play(exp.getCurrentScreen().deriv1); });  
		$("#" + exp.getCurrentScreen().item + 'pl2button').click(function(){ soundManager.play(exp.getCurrentScreen().deriv2); });  

		for (var i=1; i<=7; i++) {
			$("#" + exp.getCurrentScreen().item + 'button' + i).click(function() { exp.advance(); });
		}

	}

	this.html = function() {
	
		var str = "";


		var f1 = this.screen.frame.text.replace(/_+/, "<b><i>" + this.screen.item + "</i></b>");
		f1 = f1.replace(/_+/, '<input type="button" id="' + exp.getCurrentScreen().item + 'pl1button' +'" value="    ►    ">');
		str += '<div style="text-align:center;">' + f1 + '</div>';
		
		str += '<table border=0 style="height: 30ex; width: 100%; padding: 10px 0px 10px 0px"><tr><td style="vertical-align: middle;">'
		str += '<div id="' + exp.getCurrentScreen().item + 'response_buttons' + '" style="margin-left: 50%; display: none;">';
		for (var i=1; i<=7; i++) {
			str += '<div><input type="button" value=" '+ i +' " id="' + exp.getCurrentScreen().item + 'button' + i + '">';
			if(i==1) str += ' ⬆ I prefer the first plural ';
			if(i==4) str += ' No preference ';
			if(i==7) str += ' ⬇ I prefer the second plural ';
			str += '</div>';
		}
		str += '</div>'
		str += '</td></tr></table>'

		str += '<div id="' + exp.getCurrentScreen().item + 'secondhalf' + '" style="display: none; text-align:center;">';

		var f2 = this.screen.frame.text.replace(/_+/, "<b><i>" + this.screen.item + "</i></b>");
		f2 = f2.replace(/_+/, '<input type="button" id="' + exp.getCurrentScreen().item + 'pl2button' +'" value="    ►    ">');
		str += f2;
		str += '</div>';

		return str;
	}

}