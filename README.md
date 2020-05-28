# Experigen

A framework for creating phonology experiments.

## Who is it for? How can I get help?

Experigen is for linguists who have some basic knowledge of HTML, CSS, and Javascript,  
who know some of the basics of putting a webpage up, and who know a little bit of R  – 
or for linguists who want to learn these things, or for linguists who have someone like 
this on their team. It's not for linguists who are ''not good with computers''.

The code is provided as is. Turn to your local web expert for help with setting up 
your experiment. 

If you fixed anything or added functionality to Experigen, we invite you to contribute 
your code back to the project.

## Known limitations

Experigen requires participants to be online and be using an active internet connection. 
There is no offline mode at the moment. 

Experigen does not measure reaction times. You can only get a very rough idea of how 
fast participants are working by examining the server timestamps. There is a forked 
version that has RT measurement functionality at https://github.com/cpill0789/experigen.

## Collecting audio from participants

This seems to work on most browsers/operating systems, with the exception of iOS Chrome, so iPhone users will need to use Safari. 

You will need a server with a secure connection (https) to put your experiment in (based on the `web` folder), and another server (or the same server)  with a secure connection to collect audio from your participants. Put the files from `audioserver` there, and update `settings.js` with the URL to the audio server.

You won't be able to use https://sdb.phonologist.org/audio/upload.php, because it only accepts data that comes from https://sdb.phonologist.org/. You will be able to record audio in the browser, but not to save it. To save audio, you'll need your own server.

Demo: https://sdb.phonologist.org/experigen-demo/

## Setup

Copy the `web` folder (or just its contents) to your server. It is recommended that your server use a secure connection (https). 

Inside the `web` folder:

* Put your materials in the `resources` folder
  - Make a tab-delimited file called `items.txt`, where each line specifies
    one item (stimulus or filler). You will probably make this file in a
    spreadsheet program (Excel or some such) and save it as a text file. The
    first column in this file is special:  it uniquely identifies your items.
    It may not contain blank cells or repeated entries.
  - If your experiment contains stuff that will get randomly paired with
    your items, such as frame sentences or pictures, make tab-delimited text
    files for those, again with the first column uniquely identifying the frames
    or pictures.
  - Put audio files in mp3 format in the sounds folder, and pictures in
    the pictures folder.

* Design your experiment in the `setup` folder

  - Use `design.js` to specify the information that the participants will see
    in each screen. 
  - Use `settings.js` to specify the experiment name and the database
    server. See more below about database servers.
  - Change `styles.css` if you want to change colors, font sizes, alignments,
    and the such.

* Customize the display of the information in the `views` folder

  - Use the templates in this folder to control how the participants
    see individual screens.

* The `_lib` folder contains helper files; you don't need to go there. 

* You don't need to edit `index.html`.


## Results

Your results will accumulate on the database server you specified. 

There is a database server available at https://sdb.phonologist.org/experigen1/. 
The old database server is still at http://db.phonologist.org/.
You are welcome to use either server if you want to, so long as you don't hold us responsible for 
anything that might happen to your data. We offer this service for free and as is. You can also install your own database using the files in the folder `dbserver`.

* To download the results, use the `getresults.R` file (you'll want to install `R` if 
you don't have it already). 

* In the `getresults.R` file, specify where your experiment is hosted (line 5). For 
example, if your experiment is at
    http://www.awesome-university.edu/~hotshot/questionnaire/,
    you will write www.awesomeuniversity.edu.hotshot.questionnaire (turning slashes into periods, removing hyphens, etc.) 

* Specify your experimentName (line 7). That's the string you entered in your `settings.js`.
  
* Run the `getresults.R` file, which will download the data and save it to your computer. 

* The default names for the created files are `xp.csv` and `meta.csv`. You can open them 
in Excel or OpenOffice if you want to. They are saved to whatever `R`'s current working 
directory is.  


## Citation

Please cite Experigen whenever used in academic work:

Becker, Michael and Jonathan Levine (2020) Experigen – an online experiment platform. Available at http://becker.phonologist.org/experigen.

