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
	for (var i=0 ; i<arr.length ; i++) {
		this.push(arr[i]);
	}
}

Array.prototype.shuffle = function () {
	for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
}


Array.prototype.alertItems = function () {
	var str = ""
	for (var i=0 ; i<this.length ; i++) {
		if (this[i].item) str += this[i].item + ", ";
	}
	alert(str);
}
