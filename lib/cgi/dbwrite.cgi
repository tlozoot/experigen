#!/usr/bin/perl -T -w
use strict;
use warnings;
use Fcntl qw(:flock);
use CGI;
my $q = new CGI;

# verify that userid and username are there first
my @names = $q->param;

# un-tainting the user id
my $id = $q->param("userFileName");
$id =~ /^(\d+)$/;
my $userFileName = $1;



my @fields;
#push(@fields, $ENV{REMOTE_ADDR}          || "");
for (my $i=0 ; $i<@names; $i++) {
	push(@fields, [$names[$i] , $q->param($names[$i])]  || []);
}
push(@fields, ["time", "" . localtime()]);

for (@fields) {
	@{$_}[1] =~ s/"/'/sg;
	@{$_}[1] =~ s/\n/ /sg;
	@{$_}[1] =~ s/\r/ /sg;
	$_ = '"' . @{$_}[0] . '": "'  . @{$_}[1] .'"'; 
}

open (USER, ">>../../results/user" . $userFileName . ".txt") or die "Can't open user file. $!";
print USER '{' . join(", ",@fields) . "}\r\n" ;
close(USER) or die "Can't close user file. $!";

print $q->header(-charset=>'utf-8');
print "success";

