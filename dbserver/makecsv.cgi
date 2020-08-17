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
	$success = "false";
}

my $sourceurl = uri_escape($q->url_param("sourceurl"),"^A-Za-z0-9\_\.\%\~\!\-\*\(\)\'");
if(!$sourceurl || $sourceurl!~/^[A-Za-z0-9\_\.\%\~\!\-\*\(\)\']+$/) {
	$success = "false";
}



if ($success eq "true") {

	# un-tainting the experiment name
	my $exp = $q->url_param("experimentName");
	$exp =~ /^([A-Za-z0-9]+)$/;
	my  $experimentName = $1;

	# un-tainting the source url
	$sourceurl =~ /^([A-Za-z0-9\_\.\%\~\!\-\*\(\)\']+)$/;
	my $sourceURL = $1;

	my %data;
	$data{"default.csv"} = [];

	# go over all the user files, collect data
	opendir(USERS,$dbfolder."/".$sourceURL."/".$experimentName) or die "Couldn't open user directory $!";
	while (my $file = readdir(USERS)) {
		if ($file =~ /^user\d+.txt$/) {

			open (USER, "<" . $dbfolder . "/" . $sourceURL . "/" . $experimentName . "/" . $file) or die "Can't open user file. $!";
			while (<USER>) {
				chomp;
				# turn each line into a hash (=manual JSONing)
				s/\{//g;
				s/\}//g;
				my @temp = split(/,/);
				my %hash;
				for my $line (@temp) {
					$line =~ /^\s*\"(.*)\"\: \"(.*)\"\s*$/;
					$hash{$1} = $2;
				}
				# separate the hashes into their destinations
				if ($hash{destination}) {
					if(!exists($data{ $hash{destination} })) {
						$data{ $hash{destination} } = [];
					}
					push(@{$data{ $hash{destination}}} ,  {%hash} )
				} else {
					push(@{$data{"default.csv"}},  {%hash}   );
				}
			}
			close(USER) or die "Can't close user file. $!";

		}
	}
	closedir(USERS) or die "Couldn't close user directory $!";

	# create the tab-separated files
	my %files;
	for my $currentFile (keys %data) {

		# find all the fields in a file
		my %fields;
		for my $line (@{ $data{$currentFile} }) {
			%fields = map { $_ => 1 } keys %fields, keys %{$line};

			#$files{$currentFile} .= join("/", keys(%{$line})) . "]]]]\n"; #keys (%{$line});
		}
		delete $fields{"callback"};
		delete $fields{"sourceurl"};
		delete $fields{"_"};

		# write the tab-separated output
		$files{$currentFile} .= join("\t", sort keys(%fields)) . "\n";
		for my $line (@{ $data{$currentFile} }) {
			my @values;
			for my $key (sort keys %fields) {
				push(@values, ${$line}{$key} );
			}
			$files{$currentFile} .= join("\t",@values) . "\n"; # join("/", keys(%{$line})) . "\n";
		}
	}
	
	# print the result to the browser
	print $q->header(-charset=>'utf-8');
	if($q->url_param("file")) {
		print $files{ $q->url_param("file") } ;
	} else {
		print $files{"default.csv"} ;
	}


} else {
	print $q->header(-charset=>'utf-8');
	print "false\n" ;

}




