Array.prototype.subset = function (field, criterion) {
	arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] == criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.exclude = function (field, criterion) {
	arr = new Array();
	for (var i=0 ; i<this.length ; i++) {
		if(this[i][field] != criterion) {
			arr.push(this[i]);
		}
	}
	return arr;
}

Array.prototype.append = function (arr) {

	if (typeof arr !== "object") {
		this.push(arr);
	} else {
		for (var i=0 ; i<arr.length ; i++) {
			this.push(arr[i]);
		}
	}
	return this;
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

	if (!arr) { console.error("Can't pair with empty list!"); return false; }
	if (typeof arr === "string") { arr = [arr];}
	var arrPosition = 0;
	for (var i=0 ; i<this.length ; i++) {
		this[i][field] = arr[arrPosition];
		arrPosition++;
		if(arrPosition>=arr.length) arrPosition=0;
	}
	exp.fieldsToSave[field] = true;
	return this;
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
