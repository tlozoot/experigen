#!/usr/bin/perl -T -w
use strict;
use warnings;
use Fcntl qw(:flock);
use CGI;
my $q = new CGI;


# generate unique user id number, requires a directory names "users" with write permissions
my $userId = 0;
opendir(USERS,"../../results/") or die "Couldn't open user directory $!";
while (my $file = readdir(USERS)) {
	if ($file =~ /^user(\d+).txt$/) {
		$userId = $1 if $1>$userId;
	}
}
closedir(USERS) or die "Couldn't close user directory $!";
$userId++;


print $q->header(-charset=>'utf-8');
print $userId;

