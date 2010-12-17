Experigen.initialize = function () {
	
	
	var items  = this.resource("items");
	var frames = this.resource("frames");
	var pictures = this.resource("pictures");
	
/*	var sampleItem = items
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
*/


	var block1 =  items
			.subset("type","al-aux").subset("size","poly").chooseRandom(2)
			.pairWith("finalConsonant","j")
			.shuffle()
			.pairWith("frame", frames.shuffle())
			.shuffle()
			.pairWith("view",["sfirst.ejs","xfirst.ejs"])
			.shuffle()
			;

	var block2 =  block1
			.pairWith("finalConsonant","l")
			.shuffle()
			.pairWith("frame", frames.shuffle())
			.shuffle()
			.pairWith("view",["sfirst.ejs","xfirst.ejs"])
			.shuffle()
			;


	this.addStaticScreen("intro.ejs");
	this.addBlock(block1);
	this.addStaticScreen("getgoing.ejs");
	this.addBlock(block2);
	this.addStaticScreen("demographic.html");
	this.addStaticScreen("finalthanks.html");
	

//	this.printScreensToConsole();
	
	
}