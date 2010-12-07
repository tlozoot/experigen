#! /bin/sh

ssh -T phonetics.fas.harvard.edu <<\EOI

cd /experigen
/usr/local/git/bin/git checkout .
/usr/local/git/bin/git pull
exit

EOI