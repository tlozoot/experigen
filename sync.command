#!/bin/sh

DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

cd web/

rsync -vr * myname@myserver:mydomain.edu/folder

exit
