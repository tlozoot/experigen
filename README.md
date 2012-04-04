# Experigen

A framework for creating phonology experiments.



## Setup

* Put your materials in the "resources" folder
  - Make a tab-delimited file called items.txt, where each line specifies
    one item (stimuli or filler). You will probably make this file in a
    spreadsheet program (Excel or some such) and save it as a text file. The
    first column in this file is special:  it uniquely identifies your items.
    It may not contain blank cells or repeated entries.
  - If your experiment contains stuff that will get randomly paired with
    your items, such as frame sentences or pictures, make tab-delimited text
    files for those, again with the first column specifying the frames
    or pictures.
  - Put audio files in mp3 format in the sounds folder, and pictures in
    the pictures folder.

* Design your experiment in the "setup" folder

  - Use design.js to specify the information that the participants will see
    in each screen. 
  - Use settings.js to specify the experiment name and the database
    server. We will maintain http://db.phonologist.org/ for the foreseeable
    future. 
  - Change styles.css if you want to change colors, font sizes, alignments,
    and the such.

* Customize the display of the information in the "views" folder

  - Use the templates in this folder to control how the participants
    see individual screens.

* Your results will accumulate on the database server you specified. 

  - Download your results by specifying the name of your experiment
    and the URL of the server you put it on. For example, if your experiment
    name is "Default" (specified in setup.js), and you put it on
    http://www.awesomeuniversity.edu/~iamawesome/questionnaire/,
    you will use the following URL:
    
		http://db.phonologist.org/makecsv.cgi?experimentName=Default&sourceurl=www.awesomeuniversity.edu.iamawesome.questionnaire

  - To get demographic information, add "&file=demographics.csv" at the end, e.g.:

		http://db.phonologist.org/makecsv.cgi?experimentName=Default&sourceurl=www.awesomeuniversity.edu.iamawesome.questionnaire&file=demographics.csv


  - You can also read the information directly into R, like so:

		url  = "http://db.phonologist.org/makecsv.cgi?experimentName=Default&sourceurl=www.awesomeuniversity.edu.iamawesome.questionnaire"  
		exp  = read.csv(url, sep="\t")  
		meta = read.csv(paste(url, "&file=demographics.csv", sep=""), sep="\t")  

  - And you will probably want to change time stamps from strings to date objects:

		exp$time = as.POSIXct(strptime(as.character(exp$time), "%a %b %d %H:%M:%S %Y"))

  - Use the getresults.R file to get started.


* The "_lib" folder contains helper files; you don't need to go there. 

* You don't need to edit "index.html".

## TODO

* add response time measurements 
* send browser stats to server (with IP locator?)
* improve sound button support / better encapsulation?
* general encapuslation
