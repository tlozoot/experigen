#!/usr/bin/perl -T -w
use strict;
use warnings;
use Fcntl qw(:flock);
use CGI;
my $q = new CGI;

# verify that userid and username are there first
my @names = $q->param;

my @fields;
push(@fields, $ENV{REMOTE_ADDR}          || "");
for (my $i=0 ; $i<@names; $i++) {
	push(@fields, $q->param($names[$i])  || "");
}
push(@fields, "" . localtime());

print $q->header(-charset=>'utf-8');
print "@fields";


