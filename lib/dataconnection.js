// database connection 


Experiment.prototype.getUserID = function () {

	var data = [16, "WXN16"];
	
	this.userFileName = data[0];
	this.userCode = data[1];	

	return true;
}