#!/usr/bin/perl -T -w
use strict;
use warnings;
use Fcntl qw(:flock);
use CGI;
my $q = new CGI;
my $dbfolder = "storage";

my $success = "true";
my @names = $q->url_param;


# verify that proper identification of the data is present
if(!$q->url_param("userFileName") || $q->url_param("userFileName")!~/^(\d+)$/) {
	$success = "false";
}
if(!$q->url_param("userCode") || $q->url_param("userCode")!~/^[A-Z]+(\d+)$/) {
	$success = "false";
}
if(!$q->url_param("experimentName") || $q->url_param("experimentName")!~/^[A-Za-z0-9]+$/) {
	$success = "false";
}
if(!$q->url_param("sourceurl") || $q->url_param("sourceurl")!~/^[A-Za-z0-9\.\%\~\!\-\*\(\)\']+$/) {
	$success = "false";
}



if ($success eq "true") {

	# un-tainting the user id
	my $id = $q->url_param("userFileName");
	$id =~ /^(\d+)$/;
	my  $userFileName = $1;

	# un-tainting the experiment name
	my $exp = $q->url_param("experimentName");
	$exp =~ /^([A-Za-z0-9_]+)$/;
	my  $experimentName = $1;

	# un-tainting the source url
	my $source = $q->url_param("sourceurl");
	$source =~ /^([A-Za-z0-9_\.\%\~\!\-\*\(\)\']+)$/;
	my  $sourceURL = $1;

	# simplifying the source URL
	$sourceURL =~ s/^http%3A%2F%2F//;
	$sourceURL =~ s/^https%3A%2F%2F//;
	$sourceURL =~ s/%2F$//;
	$sourceURL =~ s/%3A/./g;
	$sourceURL =~ s/%2F/./g;
	$sourceURL =~ s/%7E//g;
	$sourceURL =~ s/%2D/./g;
	$sourceURL =~ s/%5F/./g;
	$sourceURL =~ s/~//g;


	# prepare an array to write to the server
	my @fields;
	push(@fields, ["IP", $ENV{REMOTE_ADDR}]);
	for (my $i=0 ; $i<@names; $i++) {
		push(@fields, [$names[$i] , $q->param($names[$i])]  || []);
	}
	push(@fields, ["time", "" . localtime()]);
	
	# manual JASONing
	for (@fields) {
		@{$_}[1] =~ s/"/'/sg;
		@{$_}[1] =~ s/\n/ /sg;
		@{$_}[1] =~ s/\r/ /sg;
		@{$_}[1] =~ s/,/‚/sg; 
		$_ = '"' . @{$_}[0] . '": "'  . @{$_}[1] .'"'; 
	}
	
	####can't use without the appropriate module

	# create a folder for the experiment if it isn't there
	if (-d $dbfolder."/".$sourceURL."/".$experimentName) {
		# folder exists, nothing to do
	}
	else {
		# make folder
		mkdir $dbfolder."/".$sourceURL , 0777;
		mkdir $dbfolder."/".$sourceURL."/".$experimentName, 0777;
	}


	# append JSON to user file	
	my $str = '{' . join(", ",@fields) . "}\r\n";
	open (USER, ">>". $dbfolder . "/" . $sourceURL . "/" . $experimentName . "/user" . $userFileName . ".txt") or die "Can't open user file. $!";
	print USER "$str";
	close(USER) or die "Can't close user file. $!";


	# update users file	
	my $user = $q->url_param("userCode");
	$user =~ /^([A-Z]+\d+)$/;
	my  $userCode = $1;

	$str = "$userCode\r\n";
	open (USER, ">>" . $dbfolder . "/" . $sourceURL . "/" . $experimentName . "/users.txt") or die "Can't open users file. $!";
	print USER "$str";
	close(USER) or die "Can't close users file. $!";
	
	
	
}

# wrap in JSONP function name
my $callback = $q->url_param("callback") || "";
my $str = '"' . $success . '"';
# write result
print $q->header(-type=>'text/javascript',-charset=>'utf-8');
print $callback . '(' . $str . ')' ;



