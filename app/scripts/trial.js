
function Trial(screen) {

	this.screen = screen || {};

	this.screen.base1 = "";
	this.screen.base2 = "";
	this.screen.deriv1 = "data/sounds/" + exp.getCurrentScreen().file_l;
	this.screen.deriv2 = "data/sounds/" + exp.getCurrentScreen().file_pl_l;
	this.screen.continuebutton = exp.getCurrentScreen().item + 'continue';
	this.pl1button = exp.getCurrentScreen().item + 'pl1button'
	this.pl2button = exp.getCurrentScreen().item + 'pl2button'

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
			$("#" + exp.getCurrentScreen().continuebutton).show();
		}
	});

	
	

	this.html = function() {
	
		var f1 = this.screen.frame.replace(/_+/, "<B><I>" + this.screen.item + "</I></B>");
		var b1 = '<INPUT TYPE="button" ID="' + exp.getCurrentScreen().pl1button +' " VALUE="    ►    "  onClick="soundManager.play(exp.getCurrentScreen().deriv1);">';
		f1 = f1.replace(/_+/, b1);

		var f2 = this.screen.frame.replace(/_+/, "<B><I>" + this.screen.item + "</I></B>");
		var b2 = '<INPUT TYPE="button" ID="' + exp.getCurrentScreen().pl2button +' " VALUE="    ►    "  onClick="soundManager.play(exp.getCurrentScreen().deriv2);">';
		f2 = f2.replace(/_+/, b2);
		
		var str = "";
		str += "<P>" 
		str += f1;
		str += '<DIV ID="' + exp.getCurrentScreen().item + 'secondhalf' + '" STYLE="display: none;">';
		str += f2;
		str += '</DIV>';
		str += '<INPUT TYPE="button" ID="' + exp.getCurrentScreen().continuebutton  + '" VALUE="    continue    "  onClick="exp.advance(this);" STYLE="display: none;">';

		return str;
	}

}