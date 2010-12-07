#! /bin/sh

ssh -T jon-levine.com <<\EOI

cd static/experigen
/usr/bin/git checkout .
/usr/bin/git pull
exit

EOI