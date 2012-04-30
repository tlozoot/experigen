Experigen.initialize = function () {
	
	var items  = this.resource("items");
	var frames = this.resource("frames");

	items = items.pairWith("frame", frames.shuffle())

	var sampleItem =  items.subset("type","filler").chooseRandom(1)
			.pairWith("order",1)
			.pairWith("view","stimulus.ejs")
			;

	var block1 = []
			.concat(items.subset("type","stim").subset("shape","iamb").chooseRandom(2))
			.concat(items.subset("type","stim").subset("shape","mono").chooseRandom(2))
			.concat(items.subset("type","stim").subset("shape","trochee").chooseRandom(2))
			.pairWith("view","stimulus.ejs")
			.shuffle()
			.pairWith("order",[1,2])
			.shuffle()
			;


	this.addStaticScreen("intro.ejs");
	this.addBlock(sampleItem);
	this.addStaticScreen("getgoing.ejs");
	this.addBlock(block1);
	this.addStaticScreen("demographic.ejs");
	this.addStaticScreen("finalthanks.ejs");
	
}