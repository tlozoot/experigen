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
	
	var nounBasedItems = items
			.exclude("item","farasel")
			.subset("size","poly")
			.subset("type","al-aux")
			.chooseRandom(1)
			.append(items.subset("size","mono").subset("type","el-aux").chooseRandom(1))
			.pairWith("frame", frames.excludeFirst().shuffle())
			.shuffle()
			.pairWith("finalConsonant",["l","j"])
			.shuffle()
			;
	
	var adjectiveBasedItems = items
			.subset("size","poly").subset("type","ol-ou").chooseRandom(1)
			.append(items.subset("size","mono").subset("type","aul-au").chooseRandom(1))
			.pairWith("frame", frames.excludeFirst().shuffle())
			.shuffle()
			.pairWith("finalConsonant","l")
			;
	
	nounBasedItems.append(adjectiveBasedItems)
			.shuffle()
			.pairWith("view",["sfirst.ejs","xfirst.ejs"])
			.shuffle()
			;
	
	
	this.addStaticScreen("intro.html");
	this.addBlock(sampleItem);
	this.addStaticScreen("getgoing.html");
	this.addBlock(nounBasedItems);
	this.addStaticScreen("demographic.html");
	this.addStaticScreen("finalthanks.html");

	
	this.setProgressBar(new Progressbar({adjustWidth: 4}));
	this.advance();
}