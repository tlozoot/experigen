#! /bin/sh

ssh -T dailyoperations@phonetics.fas.harvard.edu <<\EOI

cd experigen
/usr/local/git/bin/git checkout .
/usr/local/git/bin/git pull
exit

EOI