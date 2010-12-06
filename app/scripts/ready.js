function yoImReady() {


	block0 = exp.getItems().subset("item","farasel").pairWith("finalConsonant",["l"]);
	block0.pairWith("frame", exp.getFrameSentences().chooseFirst());
	block0.pairWith("rand", ["x-first"]);
	block0.shuffle();
	
	block1 = new Array();
	block1.append(exp.getItems().exclude("item","farasel").subset("size","poly").subset("type","al-aux").chooseRandom(1));
	block1.append(exp.getItems().subset("size","mono").subset("type","el-aux").chooseRandom(1));
	block1.pairWith("frame", exp.getFrameSentences().excludeFirst().shuffle());
	block1.shuffle().pairWith("finalConsonant",["l","j"]).shuffle();

	block2 = new Array();
	block2.append(exp.getItems().subset("size","poly").subset("type","ol-ou").chooseRandom(1));
	block2.append(exp.getItems().subset("size","mono").subset("type","aul-au").chooseRandom(1));
	block2.pairWith("frame", exp.getFrameSentences().excludeFirst().shuffle());
	block2.shuffle().pairWith("finalConsonant",["l"]);

	block1.append(block2).shuffle();
	block1.pairWith("rand", ["s-first","x-first"]).shuffle();

	exp.addStaticScreen({url: "app/templates/intro.html"});
	exp.addBlock(block0);
	//exp.addStaticScreen({url: "app/templates/getgoing.html"})
	//exp.addBlock(block1);
	exp.addStaticScreen({url: "app/templates/demographic.html"})
	exp.addStaticScreen({url: "app/templates/finalthanks.html"})

	exp.setProgressBar(new Progressbar({adjustWidth: 4}));
	
	exp.advance();

}