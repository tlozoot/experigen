function Progressbar(obj) {

	this.length   = obj.length || 1;
	this.adjust   = obj.adjustWidth || 1;
	this.position = obj.startat || 0;

	this.initialize = function() {
		$("#progressbar").html('<DIV ID="progress_bar_empty"></DIV><DIV ID="progress_bar_full"></DIV><DIV ID="progress_text"></DIV>')
		this.set();
	}

	this.set = function() {
		$("#progress_bar_empty").width((this.length-this.position)*this.adjust +  "px");
		$("#progress_bar_full").width((this.position)*this.adjust + "px");
		$("#progress_text").html((this.position) + "/" + this.length);
	}

	this.advance = function () {
		this.position++;
		this.set();
	}

}