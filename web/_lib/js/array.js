Array.prototype.subset = function (field, criterion) {
	var arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] === criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.exclude = function (field, criterion) {
	var arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] !== criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.excludeBlock = function (excludeArray) {
	var newArray = [];
	for (var i=0; i<this.length; i++) {
		var found = false;
		for (var j=0; j<excludeArray.length; j++) {
			if (this[i]===excludeArray[j]) {
				found = true;
			} else {
				if(Experigen && Experigen.resources && Experigen.resources.items && this[i][Experigen.resources.items.key]===excludeArray[j][Experigen.resources.items.key]) {
					found = true;
				}
			}
		}
		if (!found) {
			newArray.push(this[i]);
		}
	}
	return newArray;
}

Array.prototype.interleave = function () {
	var newArray = [];
	var args = Array.prototype.slice.call(arguments, 0); // turn "arguments" into a real array (of arrays)
	args.unshift(this); // add the current array as the first member in the array of arrays
	var maxLen = $.map( args , function(val, i) { return val.length; } ).sort().reverse()[0]; // find the length of the longest array

	for (var i=0; i<maxLen; i++) {
		for (var j=0; j<args.length; j++) {
			if (args[j][i]) {
				newArray.push(args[j][i]);
			}
		} 
	}
	return newArray;
}


Array.prototype.chooseFirst = function (i) {
		if (!i) {
			return this.slice(0,1);
		} else {
			return this.slice(0,i);
		}
}

Array.prototype.excludeFirst = function (i) {
		if (!i) {
			return this.slice(1,this.length);
		} else {
			return this.slice(i,this.length);
		}
}


Array.prototype.chooseRandom = function (i) {
	var arr = this;
	return arr.shuffle().chooseFirst(i);
}


Array.prototype.pairWith = function (field, arr) {

	if (arr===undefined || arr===null) { console.error("Can't pair with empty list!"); return false; }
	if (Object.prototype.toString.apply(arr)!=='[object Array]') { arr = [arr];}

	/// clone this
	var newArray = [];
	for (var i=0; i<this.length; i+=1) {
		newArray.push(jQuery.extend(true, {}, this[i]));
	}

	var arrPosition = 0;
	for (var i=0 ; i<newArray.length ; i++) {
		newArray[i][field] = arr[arrPosition];
		arrPosition++;
		if(arrPosition>=arr.length) arrPosition=0;
	}
	if (Experigen) { 
		Experigen.fieldsToSave[field] = true; 
	}
	return newArray;
}



Array.prototype.shuffle = function () {
	var arr  = new Array();
	for (var i=0 ; i<this.length ; i++) {
		arr.push(this[i]);
	}
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	return arr;
}


Array.prototype.uniqueNonEmpty = function () {
	
	var noempties = true;
	var hash = {};
	for (var i=0 ; i<this.length ; i++) {
		if (!this[i] || this[i]=="") {
			noempties = false;
		} else {
			hash[this[i]] = "1";
		}
	}
	var hashlength=0;
	for (i in hash) {hashlength++};
	return (this.length===hashlength && noempties);
}

Array.prototype.repeat = function (num) {

	var newArray = [];
	for (var i=0; i<num; i++) {
		newArray = newArray.concat(this);
	}
	return newArray;
}


String.prototype.repeat = function (num) {

	var newArray = [];
	for (var i=0; i<num; i++) {
		newArray.push(this.toString());
	}
	return newArray;
}

Boolean.prototype.repeat = function (num) {

	var newArray = [];
	for (var i=0; i<num; i++) {
		newArray.push(this==true);
	}
	return newArray;
}


Number.prototype.repeat = function (num) {

	var newArray = [];
	for (var i=0; i<num; i++) {
		newArray.push(parseFloat(this));
	}
	return newArray;
}



