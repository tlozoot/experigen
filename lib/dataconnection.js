// connection to local text files and to the database

Experiment.prototype.loadUserID = function () {

	var that = this;
	$.ajax({
		url: "lib/getuserid.cgi",  //CONFIG.proxyURL +
		success: function (data) {
			// currently just accepts whatever getuserid.cgi gives, probably a good idea to check this
			that.userFileName = data;
			return true;
		},
		async: false,
		error: function() {
			console.error("Error! User id could not be generated.");
			return false;
		}
	});
	var code =  String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26)) + String.fromCharCode(65 + Math.floor(Math.random()*26));
	this.userCode = code + that.userFileName;	
	//console.log(this.userCode);
	//this.fieldsToSave["userCode"] = true;
	//this.fieldsToSave["userFileName"] = true;
	return true;
}

Experiment.prototype.sendForm = function (formObj) {
	//console.debug(formObj.serialize());
	$.ajax({
		type: 'POST',
		url: "lib/dbwrite.cgi",  //CONFIG.proxyURL +
		data: formObj.serialize(),
		success: function (data) {
			//console.debug(data);
			return true;
		},
		async: false,
		error: function() {
			console.error("Error! Your response could not be saved.");
			return false;
		}
	});
}

Experiment.prototype.loadText = function (spec) {
	var url = spec.url;
	var wait = spec.wait;
	var destination = spec.destination;
	
	$.ajax({
		url: url,
		success: function (data) {
			$("#footer").html(data);
		},
		async: !wait,
		error: function() {
			console.error("Error! Footer not found.");
		}
	});
}


Experiment.prototype.loadResource = function (name) {

	var key = "";
	var items = [];
	
	$.ajax({
		url: CONFIG.proxyURL +  name,
		success: function(data) {
			var lines = data.split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
			key = fields[0]; // for now, the "key" for a tab-delimited file is always the first before the file's first tab
			if (!fields.uniqueNonEmpty()) {
				console.error("Field names in " + name + " must be unique and non-empty!");
				return false;
			}
			var keys = []; // these are saved to be evaluated by uniqueNonEmpty()
			LINE: for (var i=1; i<lines.length; i++) {
				if (lines[i].match(/^\s*$/)) {
					continue LINE;
				}
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
				keys.push(line[0]);
				var frame = {};
				for (var j=0; j<line.length; j++) {
					frame[ fields[j] ] = line[j];
				}
				//console.log(frame);
				items.push(frame);
			}
			if(!keys.uniqueNonEmpty()) {
				console.error("In " + name + ", the values of the first column must be unique and non-empty!");
				return false;
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("The file " + name + " wasn't found.");
			return false;
		}
	});
	
	return {table: items, key: key};
}


