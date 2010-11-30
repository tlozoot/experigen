#!/usr/bin/env python
# coding=utf-8

import os
from stat import *

import json


os.chmod("../users", S_IRUSR|S_IWUSR|S_IXUSR | S_IRGRP|S_IWGRP|S_IXGRP | S_IROTH|S_IWOTH|S_IXOTH)

os.chmod("getUserCode.cgi", S_IRUSR|S_IWUSR|S_IXUSR | S_IRGRP        |S_IXGRP | S_IROTH        |S_IXOTH)
os.chmod("getItems.cgi", S_IRUSR|S_IWUSR|S_IXUSR | S_IRGRP        |S_IXGRP | S_IROTH        |S_IXOTH)


# return filename and userCode
print 'Content-Type: text/html; charset=utf-8\n'
print json.dumps(0)

