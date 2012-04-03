url  = "http://db.phonologist.org/makecsv.cgi?experimentName=Default&sourceurl=www.awesomeuniversity.edu.iamawesome.questionnaire"
exp  = read.csv(url, sep="\t")
exp$time = as.POSIXct(strptime(as.character(exp$time), "%a %b %d %H:%M:%S %Y"))
meta = read.csv(paste(url, "&file=demographics.csv", sep=""), sep="\t")
meta$time = as.POSIXct(strptime(as.character(meta$time), "%a %b %d %H:%M:%S %Y"))
