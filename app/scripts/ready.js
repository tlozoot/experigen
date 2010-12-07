Experiment.prototype.initialize = function () {

	var items = this.getItems();

	var block0 = items.subset("item","farasel").pairWith("finalConsonant",["l"]);
	block0.pairWith("frame", this.getFrameSentences().chooseFirst());
	block0.pairWith("rand", ["x-first"]);
	block0.shuffle();
	
	var block1 = new Array();
	block1.append(items.exclude("item","farasel").subset("size","poly").subset("type","al-aux").chooseRandom(1))
	      .append(items.subset("size","mono").subset("type","el-aux").chooseRandom(1))
	      .pairWith("frame", this.getFrameSentences().excludeFirst().shuffle())
	      .shuffle().pairWith("finalConsonant",["l","j"]).shuffle();

	var block2 = new Array();
	block2.append(items.subset("size","poly").subset("type","ol-ou").chooseRandom(1))
	      .append(items.subset("size","mono").subset("type","aul-au").chooseRandom(1))
	      .pairWith("frame", this.getFrameSentences().excludeFirst().shuffle())
	      .shuffle().pairWith("finalConsonant",["l"]);

	block1.append(block2).shuffle();
	block1.pairWith("rand", ["s-first","x-first"]).shuffle();

	this.addStaticScreen({url: "app/templates/intro.html"});
	this.addBlock(block0);
	this.addStaticScreen({url: "app/templates/getgoing.html"})
	this.addBlock(block1);
	this.addStaticScreen({url: "app/templates/demographic.html"})
	this.addStaticScreen({url: "app/templates/finalthanks.html"})

	this.setProgressBar(new Progressbar({adjustWidth: 4}));
	this.advance();

}