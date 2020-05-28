Experigen.initialize = function () {
	
	var items  = this.resource("items");
	var frames = this.resource("frames");

	items = items.pairWith("frame", frames.shuffle())

	var sampleItem =  items.subset("item","cretum")
			.pairWith("order",1)
			.pairWith("view","stimulus.ejs")
			;

	var block1 = []
			.concat(items.subset("type","stim").subset("shape","iamb").chooseRandom(0))
			.concat(items.subset("type","stim").subset("shape","mono").chooseRandom(2))
			.concat(items.subset("type","stim").subset("shape","trochee").chooseRandom(0))
			.pairWith("view","stimulus.ejs")
			.shuffle()
			.pairWith("order",[1,2])
			.shuffle()
			;

	this.addStaticScreen("intro.ejs");
	this.addStaticScreen("intro2.ejs");
	this.addBlock(sampleItem);
	this.addStaticScreen("getgoing.ejs");
	this.addBlock(block1);
	this.addStaticScreen("demographic.ejs");
	this.addStaticScreen("finalthanks.ejs");
	
}