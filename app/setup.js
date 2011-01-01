var Experigen = (function() { return {

	settings: {
	
		experimentName: "Fido", // use only A-Z, a-z, 0-9
		
		databaseServer: "http://localhost/surveys/db/",
		//databaseServer: "http://phonetics.fas.harvard.edu/surveys/db/",
		
		strings: {
			windowTitle:    "Awesomeness",
			loading:        "Loading...",
			errorMessage:   "An error occurred. We apologize for the inconvenience.",
			soundButton:    "    ►    ",
			continueButton: "   continue   ",
			emptyBoxMessage: "Please supply your answer in the text box."
		},
		
		audio: true,
		
		progressbar: {
			visible: true, 
			adjustWidth: 6,
			percentage: true
		},
		
		resouces: {
			items: true,
			frames: true,
			pictures: true	
		}
	}	
	
}; }());


