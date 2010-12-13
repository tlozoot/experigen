Experiment.prototype.initialize = function () {
	
	var items  = this.getItems();
	var frames = this.getFrameSentences();
	var pictures = this.getPictures();
	
	var sampleItem = items
			.subset("item","farasel").pairWith("finalConsonant","l")
			.pairWith("frame", frames.chooseFirst())
			.shuffle()
			.pairWith("view","xfirst.ejs")
			;
	//console.log(sampleItem);

	var nounBasedItems = items
			.exclude("item","farasel")
			.subset("size","poly")
			.subset("type","al-aux")
			.chooseRandom(1)
			.concat(items.subset("size","mono").subset("type","el-aux").chooseRandom(1))
			.pairWith("frame", frames.excludeFirst().shuffle())
			.shuffle()
			.pairWith("finalConsonant",["l","j"])
			.shuffle()
			;
	//console.log(nounBasedItems);
	
	var adjectiveBasedItems = items
			.subset("size","poly").subset("type","ol-ou").chooseRandom(1)
			.concat(items.subset("size","mono").subset("type","aul-au").chooseRandom(1))
			.pairWith("frame", frames.excludeFirst().shuffle())
			.shuffle()
			.pairWith("finalConsonant","l")
			;
	//console.log(adjectiveBasedItems);
	
	nounBasedItems = nounBasedItems
	        .concat(adjectiveBasedItems)
			.shuffle()
			.pairWith("view",["sfirst.ejs","xfirst.ejs"])
			.shuffle()
			;
	
	//console.log(nounBasedItems);
	
	this.addStaticScreen("intro.ejs");
	this.addBlock(sampleItem);
	this.addStaticScreen("getgoing.ejs");
	this.addBlock(nounBasedItems);
	this.addStaticScreen("demographic.html");
	this.addStaticScreen("finalthanks.html");

	//this.printScreensToConsole();
	
	this.advance();
	
}