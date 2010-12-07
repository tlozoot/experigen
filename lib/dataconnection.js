// database connection 


Experiment.prototype.loadUserID = function () {

	var data = [16, "WXN16"];
	
	this.userFileName = data[0];
	this.userCode = data[1];	

	return true;
}

Experiment.prototype.sendForm = function (formObj) {
	console.debug($("#" + formObj.name).serialize());
	$.ajax({
		type: 'POST',
		url: CONFIG.proxyURL + "lib/dbwrite.cgi",
		data: $("#" + formObj.name).serialize(),
		success: function (data) {
			return true;
		},
		async: false,
		error: function() {
			alert("Error! Your response could not be saved.");
			return false;
		}
	});
}


Experiment.prototype.loadItems = function () {
	var e = this;
	$.ajax({ 
		url: CONFIG.proxyURL + "data/items.txt",
		success: function(data) {
			// in here, "this" is not the experiment!!!
			// it's some jquery thing
			var lines = data.replace("\r","").split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
			for (var i=1; i<lines.length; i++) {
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
				var item = {};
				for (var j=0; j<line.length; j++) {
					item[ fields[j] ] = line[j];
				}
				item.screentype = e.TRIAL;
				e.items.push(item);
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("Oh no!");
			return false;
		}
	});
	return true;
}

Experiment.prototype.loadFrameSentences = function () {
	var e = this;
	$.ajax({
		url: CONFIG.proxyURL + "data/frames.txt",
		success: function(data) {
			// in here, "this" is not the experiment!!!
			// it's some jquery thing
			var lines = data.split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
			for (var i=1; i<lines.length; i++) {
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
				var frame = {};
				for (var j=0; j<line.length; j++) {
					frame[ fields[j] ] = line[j];
				}
				e.frames.push(frame);
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("Oh no!");
			return false;
		}
	});
	return true;
}
