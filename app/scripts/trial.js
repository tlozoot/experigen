
function Trial(screen) {

	this.screen = screen || {};

	this.screen.base1 = "";
	this.screen.base2 = "";
	this.screen.deriv1 = "sounds/" + exp.getCurrentScreen()["file_l"];
	this.screen.deriv2 = "";
	this.screen.continuebutton = exp.getCurrentScreen().item + 'continue'

	soundManager.createSound({
		id: exp.getCurrentScreen().deriv1,
		url: exp.getCurrentScreen().deriv1,
		autoPlay: false, 
		autoLoad: true,
		onload:function() {
		},
		onfinish:function() {
			$("#" + exp.getCurrentScreen().continuebutton).show();
		}
	});

	this.html = function() {
		var str = "";
		str += "<P>" 
		str += this.screen.item;
		str += "<P>";
		str += '<INPUT TYPE="button" VALUE="    ►    "  onClick="soundManager.play(exp.getCurrentScreen().deriv1);">';
		str += "<P>";
		str += '<INPUT TYPE="button" ID="' + exp.getCurrentScreen().continuebutton  + '" VALUE="    continue    "  onClick="exp.advance(this);" STYLE="display: none;">';

		return str;
	}

}