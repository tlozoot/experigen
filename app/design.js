Experigen.initialize = function () {
	
	// remember to give your experiment a name in setup.js
	
	var items  = this.resource("items");
	var frames = this.resource("frames");
	var pictures = this.resource("pictures");

	var block1 =  items
			.subset("type","al-aux").subset("size","poly").chooseRandom(2)
			.pairWith("finalConsonant","j")
			.shuffle()
			.pairWith("frame", frames.shuffle())
			.shuffle()
			.pairWith("view",["sfirst.ejs"])
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
	//this.addBlock(block2);
	this.addStaticScreen("demographic.html");
	this.addStaticScreen("finalthanks.html");
	

//	this.printScreensToConsole();
	
	
}