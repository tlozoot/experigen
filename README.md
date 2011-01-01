# Experigen

A framework for creating phonology experiments.



## Setup

* Put your materials in the "data" folder
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

* Design your experiment in the "app" folder

  - Use setup.js to specify the experiment name (important!) and the database
    server. We will maintain http://phonetics.fas.harvard.edu/surveys/db/
    for the foreseeable future. 
  - Use design.js to specify the information that the participants will see
    in each screen. 
  - The templates folder specifies how the information in each screen is
    laid out.
  - Change custom.css if you want to change colors, font sizes, alignments,
    and the such.

* The "lib" folder contains helper files; hopefully you won't need to go there. 

* Your results will accumulate on the database server you specified. To get
  your results... (we'll email them to you until we make an online interface.)



## TODO


* write the perl/python script that creates R-ready files
* add response time measurements 
* add source URL to all forms
* send browser stats to server (with IP locator?)
* improve sound button support / better encapsulation?
* general encapuslation
