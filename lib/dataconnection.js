// database connection 


Experiment.prototype.loadUserID = function () {

	var data = [16, "WXN16"];
	
	this.userFileName = data[0];
	this.userCode = data[1];	

	this.fieldsToSave["userCode"] = "x";
	return true;
}

Experiment.prototype.sendForm = function (formObj) {
	//console.debug(formObj.serialize());
	var a = $.map( formObj.serialize().split("&") , function(x) { var a = x.split("="); var b = {}; b[a[0]] = a[1]; return b; });
	//console.debug($.toJSON(a));
	$.ajax({
		type: 'POST',
		url: CONFIG.proxyURL + "lib/dbwrite.cgi",
		data: $.toJSON(a),
		success: function (data) {
			return true;
		},
		async: false,
		error: function() {
			console.error("Error! Your response could not be saved.");
			return false;
		}
	});
}


Experiment.prototype.loadItems = function () {
	var e = this;
	var key = "";
	$.ajax({ 
		url: CONFIG.proxyURL + "data/items.txt",
		success: function(data) {
			// in here, "this" is not the experiment!!!
			// it's some jquery thing
			var lines = data.replace("\r","").split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
			if (!fields.uniqueNonEmpty()) {
				alert("Field names in items.txt must be unique and non-empty!");
				return false;
			}
			key = fields[0];
			var keys = new Array();
			for (var i=1; i<lines.length; i++) {
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
				keys.push(line[0]);
				var item = {};
				for (var j=0; j<line.length; j++) {
					item[ fields[j] ] = line[j];
				}
				item.screentype = e.TRIAL;
				e.items.push(item);
			}
			if(!keys.uniqueNonEmpty()) {
				alert("In items.txt, the values of the first column must be unique and non-empty!");
				return false;
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("Oh no!");
			return false;
		}
	});
	e.fieldsToSave[key] = "x";
	return true;
}

Experiment.prototype.loadFrameSentences = function () {
	var e = this;
	var key = "";
	$.ajax({
		url: CONFIG.proxyURL + "data/frames.txt",
		success: function(data) {
			// in here, "this" is not the experiment!!!
			// it's some jquery thing
			var lines = data.split("\n");
			var fields = lines[0].replace(/(\n|\r)+$/, '').split("\t");
			if (!fields.uniqueNonEmpty()) {
				alert("Field names in frames.txt must be unique and non-empty!");
				return false;
			}
			key = fields[0];
			var keys = new Array();
			for (var i=1; i<lines.length; i++) {
				var line = lines[i].replace(/(\n|\r)+$/, '').split("\t");
				keys.push(line[0]);
				var frame = {};
				for (var j=0; j<line.length; j++) {
					frame[ fields[j] ] = line[j];
				}
				e.frames.push(frame);
			}
			if(!keys.uniqueNonEmpty()) {
				alert("In frames.txt, the values of the first column must be unique and non-empty!");
				return false;
			}
			return true;
		},
		async: false,
		error: function() {
			console.error("Oh no!");
			return false;
		}
	});
	e.frameKey = key;
	return true;
}
