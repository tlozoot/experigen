var Experigen =  {
	settings: {

		experimentName: "Default", // use only A-Z, a-z, 0-9
		
		databaseServer: "http://db.phonologist.org/",
		
		strings: {
			windowTitle:     "Awesomeness",
			loading:         "Loading...",
			soundButton:     "    ►    ",
			continueButton:  "   continue   ",
			errorMessage:    "An error occurred. We apologize for the inconvenience.",
			emptyBoxMessage: "Please supply your answer in the text box.",
			feedbackRight:   "Pretty good!",
			feedbackWrong:   "We were expecting something like RIGHTANSWER."
		},
		
		audio: true,
		
		progressbar: {
			visible: true, 
			adjustWidth: 6,
			percentage: false
		},
		
		tabdelimitedfiles: {
			items: "resources/items.txt",
			frames: "resources/frames.txt",
			pictures: "resources/pictures.txt"	
		},

		folders: {
			sounds: "resources/sounds",
			pictures: "resources/pictures"
		},
	
		footer: "views/footer.html",
		missingview: "views/missingview.ejs"
	}	
};


