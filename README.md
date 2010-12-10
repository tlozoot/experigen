# experiGEN

A framework for creating phonology experiments.



## Setup

* Put your materials in the "data" folder
  - Make a tab-delimited file called items.txt, where each line specifies one item (stimuli or filler). You will probably make this file
    in a spreadsheet program (Excel or some such) and save it as a text file. The first column in this file is special: 
    it identifies your items. It may not contain blank cells or repeated entries.
  - If your experiment containts stuff that will get randomly paired with your items, such as 
    frame sentences or pictures, make tab-delimited text files for those, again with the first column specifying the frames or pictures.
  - Put audio files in mp3 format in the sounds folder, and pictures in the pictures folder.

* Design your experiment in the "app" folder

  - Use design.js to specify the information that the participants will see in each screen. 
  - The templates folder specifies how the information in each screen is laid out.
  - Change custom.css if you want to change colors, font sizes, alignments, and the such.

* Your results will accumulate in the "results" folder

* The "lib" folder contains helper files; hopefully you won't need to go there. 


## TODO

* Documentation
* Examples
* Jon:
  - Couch? http://guide.couchdb.org/
    - security: http://blog.couchone.com/post/1027100082/whats-new-in-couchdb-1-0-part-4-securityn-stuff
