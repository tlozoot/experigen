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


#items = [{"item":"cral","type":"al","size":"mono","file.l":"cral_2632.wav.mp3"},{"item":"pral","type":"al","size":"mono","file.l":"pral_207.wav.mp3"},{"item":"farasel","type":"el","size":"poly","file.l":"farasel_215_215.wav.mp3"}]
#random.shuffle(items)

print 'Content-Type: text/html; charset=utf-8\n'
print json.dumps(items)

