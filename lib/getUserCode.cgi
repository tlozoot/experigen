#!/usr/bin/env python
# coding=utf-8
import os
import re
import random
import json

# this part can probably be rewritten with fewer lines: 
userID = 0;
# for f in os.listdir("../users/"):
#   a = re.search("user(\d+)\.txt", f)
#   if a: 
#     if (int(a.group(1)) > userID): userID = int(a.group(1))
# userID += 1

fileName = 'user' + str(userID) + '.txt'
userCode = "".join(chr(random.choice(range(65,65+26))) for x in range(3)) + str(userID)

# create user file (not yet... or maybe use a database?)
#FILE = open('../users/' + fileName,'w')
#FILE.close()

# return filename and userCode
print 'Content-Type: text/html; charset=utf-8\n'
print json.dumps([fileName,userCode])

