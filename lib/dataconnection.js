// database connection 


Experiment.prototype.loadUserID = function () {

	var data = [16, "WXN16"];
	
	this.userFileName = data[0];
	this.userCode = data[1];	

	return true;
}



Experiment.prototype.loadFrameSentences = function () {

	//this.frames = new Array();	

	$.get("data/frames.txt", function(data) {
		this.frames = data.split("\n");
		//alert(this.frames);
	});
	return true;

}
