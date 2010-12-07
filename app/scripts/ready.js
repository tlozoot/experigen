Experiment.prototype.initialize = function () {

	var items = this.getItems();

	var sampleItem = 
	    items.subset("item","farasel").pairWith("finalConsonant",["l"])
	         .pairWith("frame", this.getFrameSentences().chooseFirst())
	         .pairWith("rand", ["x-first"])
	         .shuffle();
	
	var nounBasedItems = 
	    items.exclude("item","farasel").subset("size","poly").subset("type","al-aux").chooseRandom(1)
	         .append(items.subset("size","mono").subset("type","el-aux").chooseRandom(1))
	         .pairWith("frame", this.getFrameSentences().excludeFirst().shuffle())
	         .shuffle().pairWith("finalConsonant",["l","j"]).shuffle();

	var adjectiveBasedItems = 
	    items.subset("size","poly").subset("type","ol-ou").chooseRandom(1)
	         .append(items.subset("size","mono").subset("type","aul-au").chooseRandom(1))
	         .pairWith("frame", this.getFrameSentences().excludeFirst().shuffle())
	         .shuffle().pairWith("finalConsonant",["l"]);

	nounBasedItems.append(adjectiveBasedItems).shuffle()
	              .pairWith("rand", ["s-first","x-first"]).shuffle();

	this.addStaticScreen({url: "app/templates/intro.html"});
	this.addBlock(sampleItem);
	this.addStaticScreen({url: "app/templates/getgoing.html"})
	this.addBlock(nounBasedItems);
	this.addStaticScreen({url: "app/templates/demographic.html"})
	this.addStaticScreen({url: "app/templates/finalthanks.html"})

	this.setProgressBar(new Progressbar({adjustWidth: 4}));
	this.advance();

}