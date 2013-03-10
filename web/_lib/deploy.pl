#!/usr/bin/perl -w
use strict;    
use warnings;  
use utf8;
binmode STDOUT, ":utf8";


my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
my @outputFile;
$outputFile[0] = 'experigen1-' . (1900+$year) . '-' . (1+$mon) . '-' . $mday . '.js';
$outputFile[1] = 'experigen2-' . (1900+$year) . '-' . (1+$mon) . '-' . $mday . '.js';

my @inputfile;
$inputfile[0] = [];
push(@{$inputfile[0]}, "jquery/jquery-1.7.2.min.js");
push(@{$inputfile[0]}, "jquery/jquery.total-storage.min.js");
push(@{$inputfile[0]}, "ejs/ejs_production.js");
push(@{$inputfile[0]}, "soundman/script/soundmanager2-nodebug-jsmin.js");
push(@{$inputfile[0]}, "soundman/config.js");
push(@{$inputfile[0]}, "js/array.js");

$inputfile[1] = [];
push(@{$inputfile[1]}, "js/trial.js");
push(@{$inputfile[1]}, "js/dataconnection.js");
push(@{$inputfile[1]}, "js/experiment.js");
push(@{$inputfile[1]}, "js/launch.js");

# remove the old js files
system("rm experigen*.js");

for (my $i=0; $i<2; $i++) {
	open (OUTPUT,  ">:utf8" , "" . $outputFile[$i]) or die "Can't write output file $!";
	print OUTPUT "// nothing to edit here; this file was created by deploy.pl\n\n\n";
	for my $input (@{$inputfile[$i]}) {
		print OUTPUT "\n\n\n//printing the content of $input\n\n;";
		open (INPUT,  "<:utf8" , $input) or die "Can't read input file $!";
		while (<INPUT>) {
			print OUTPUT;
		}
		close(INPUT) or die "OMG Can't close input file $!";
	}
	close(OUTPUT) or die "OMG Can't close output file $!";
}

open (OUTPUT,  ">:utf8" , "../" . "index.html") or die "Can't write output file $!";
print OUTPUT <<"EOF";
<!DOCTYPE html PUBLIC "-//W3C//DTD html 4.0 Transitional//EN">
<html>
<head>
	<title></title>
	<meta HTTP-EQUIV="Content-Type" content="text/html; charset=utf-8">
	<meta HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<meta HTTP-EQUIV="Expires" CONTENT="-1">

<!--
	Nothing to edit here; this file was created by deploy.pl.
-->

	<link rel='stylesheet' href='setup/styles.css' type='text/css'>
	<script type="text/javascript" src="_lib/$outputFile[0]"></script>
	<script type="text/javascript" src="setup/settings.js"></script>
	<script type="text/javascript" src="setup/design.js"></script>
	<script type="text/javascript" src="_lib/$outputFile[1]"></script>

  
</head>
<body></body>
</html>
EOF
close(OUTPUT) or die "OMG Can't close output file $!";





