# Experigen

A framework for creating phonology experiments.



## Setup

* Copy the "web" folder to your server. Inside the "web" folder:

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

* Your results will accumulate on the database server you specified. Currently, there is only one database server available at http://db.phonologist.org/. You are welcome to use it.

  - To download the results, use the getresults.R file (you'll want to install R if you don't have it already). 

  - In the getresults.R file, specify where your experiment is hosted (line 2). For example, if your experiment is at
    http://www.awesomeuniversity.edu/~iamawesome/questionnaire/,
    you will write www.awesomeuniversity.edu.iamawesome.questionnaire (turning slashes into periods, etc.) 

  - Specify your experimentName (line 4). That's the string you entered in your settings.js.
  
  - Run the getresults.R file, which will download the data and save it to your computer.


* The "_lib" folder contains helper files; you don't need to go there. 

* You don't need to edit "index.html".

## TODO

* add response time measurements 
* send browser stats to server (with IP locator?)
* improve sound button support / better encapsulation?
* general encapuslation
