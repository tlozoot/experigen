# where your experiment is hosted
# removing initial "http://" and tildes
# and substituting slashes, etc. with periods
# no hyphens/dashes, alas (known bug)
experigen.sourceURL = "www.awesomeuniversity.edu.iamawesome.questionnaire"
# this information comes from your settings.js file
experigen.experimentName = "Default"
experigen.database = "http://db.phonologist.org/"

# first, send some info to the server with the current 
# sourceURL and experimentName by submitting at least one screen
# to the server.
# otherwise, the server will return an error message

# check for usage of the experiment (number of page views per participant)
experigen.users  =  paste(experigen.database, "users.cgi?experimentName=", experigen.experimentName, "&sourceurl=", experigen.sourceURL, sep="")
read.csv(experigen.users, sep="\t")


# read the experimental results from the server
experigen.url  =  paste(experigen.database, "makecsv.cgi?experimentName=", experigen.experimentName, "&sourceurl=", experigen.sourceURL, sep="")
xp  = read.csv(experigen.url, sep="\t")
xp$time = as.POSIXct(strptime(as.character(xp$time), "%a %b %d %H:%M:%S %Y"))
meta = read.csv(paste(experigen.url, "&file=demographics.csv", sep=""), sep="\t")
meta$time = as.POSIXct(strptime(as.character(meta$time), "%a %b %d %H:%M:%S %Y"))

# assuming all went well, write to disk
# so that the results are saved even after the database server is gone
# it would be unwise not to keep a local copy of your results
write.csv(xp, "xp.csv")
write.csv(meta, "meta.csv")

# optional cleanup: remove all variables that begin with "experigen."
rm(list=ls(pattern="^experigen."))
