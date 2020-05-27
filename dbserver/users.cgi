#!/usr/bin/perl -T -w
use strict;
use warnings;
use Fcntl qw(:flock);
use CGI;
my $q = new CGI;
use URI::Escape;
my $dbfolder = "storage";

#use JSON;



my $success = "true";
my @names = $q->url_param;


# verify that the experiment name is there
if(!$q->url_param("experimentName") || $q->url_param("experimentName")!~/^[A-Za-z0-9]+$/) {
	$success = "false1";
}

my $sourceurl = uri_escape($q->url_param("sourceurl"),"^A-Za-z0-9\.\%\~\!\-\*\(\)\'");
if(!$sourceurl || $sourceurl!~/^[A-Za-z0-9\.\%\~\!\-\*\(\)\']+$/) {
	$success = "false2";
}



if ($success eq "true") {

	# un-tainting the experiment name
	my $exp = $q->url_param("experimentName");
	$exp =~ /^([A-Za-z0-9]+)$/;
	my  $experimentName = $1;

	# un-tainting the source url
	$sourceurl =~ /^([A-Za-z0-9\.\%\~\!\-\*\(\)\']+)$/;
	my $sourceURL = $1;

	my %users;

	# go over users file, collect data
	open (USERS, "<" . $dbfolder . "/" . $sourceURL . "/" . $experimentName . "/users.txt") or die "Can't open users file. $!";
	while (<USERS>) {
		s/[\r\n]//g;
		$users{$_}++;
	}
	close(USERS) or die "Can't close users file. $!";

	# create the tab-separated files
	my $tabs = "userCode\trecords\r\n";
	for my $key (keys %users) {
		$tabs .= $key . "\t" . $users{$key} . "\r\n"; 
	}
	
	# print the result to the browser
	print $q->header(-charset=>'utf-8');
	print $tabs;


} else {
	print $q->header(-charset=>'utf-8');
	print "$success\n" ;

}




