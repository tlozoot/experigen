#!/usr/bin/env python
# coding=utf-8
import random
import json
import os

FILE = open('../dynamic/items.txt' ,'r')
lines =  FILE.readlines();
FILE.close()

fields = lines[0].rstrip().split("\t")

items = []
for x in lines[1:]:
	item = {}
	for i in range(len(x.rstrip().split("\t"))):
		item[ fields[i] ] = x.rstrip().split("\t")[i] 		
	items.append(item)



print 'Content-Type: text/html; charset=utf-8\n'
print json.dumps(items)

