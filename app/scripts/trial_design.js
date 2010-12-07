Trial.prototype.html = function() {


	exp.getCurrentScreen().singular = (exp.getCurrentScreen().finalConsonant=="l") ? exp.getCurrentScreen().item : exp.getCurrentScreen().item_j;

	var sound_pl1 = "data/sounds/" + exp.getCurrentScreen()["file_" + exp.getCurrentScreen().finalConsonant];
	var f1 = exp.getCurrentScreen().frame.text.replace(/_+/, "<b><i>" +  exp.getCurrentScreen().singular + "</i></b>");
	f1 += exp.getCurrentScreen().makeSoundButton({soundFile: sound_pl1});

	var sound_pl2 = "data/sounds/" + exp.getCurrentScreen()["file_pl_" + exp.getCurrentScreen().finalConsonant];
	var f2 = exp.getCurrentScreen().frame.text.replace(/_+/, "<b><i>" +  exp.getCurrentScreen().singular + "</i></b>");
	f2 += exp.getCurrentScreen().makeSoundButton({soundFile: sound_pl2});
	
	if (exp.getCurrentScreen().rand == "x-first") {
		var temp = f1;
		f1 = f2; 
		f2 = temp;
	}

	var part1 = exp.getCurrentScreen().makePart(f1);
	var part2 = exp.getCurrentScreen().makePart(f2);


	//var scale = exp.getCurrentScreen().makeScale({direction: exp.getCurrentScreen().HORIZONTAL, buttons: ["1","2","3","4","5","6","7"], rightlabels: ['⬆ I prefer the first plural','','','No preference','','','⬇ I prefer the second plural'], leftlabels:['&nbsp;']});
	var scale = exp.getCurrentScreen().makeScale({direction: exp.getCurrentScreen().HORIZONTAL, buttons: ["1","2","3","4","5","6","7"], leftlabels:['Good','','','','','',''], rightlabels: ['','','','','','','Bad']});
	var part3 = exp.getCurrentScreen().makePart(scale);

	
	exp.getCurrentScreen().addPart(part1);
	exp.getCurrentScreen().addPart(part3);
	exp.getCurrentScreen().addPart(part2);
	
	exp.getCurrentScreen().save({
		"item" : exp.getCurrentScreen().item, 
		"final": exp.getCurrentScreen().finalConsonant,
		"frame": exp.getCurrentScreen().frame.id,
		"rand" : exp.getCurrentScreen().rand
	});
	
	
	return exp.getCurrentScreen().htmlStr;
}
