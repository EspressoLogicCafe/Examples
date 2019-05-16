#!/usr/bin/perl

$i=0;
print "\n","\n","hello world","\n","\n" ;

use strict;
use warnings;
use LWP::Simple;    # see http://www.perl.com/pub/2002/08/20/perlandlwp.html,  http://www.tutorialspoint.com/perl/
#use JSON;
use MIME::Base64;

my $url = 'http://localhost:8080/rest/default/b2bderbynw/v1/nw:Orders/2000';
          # ACME boomerang

print "using url: ", $url, "\n","\n" ;

my $response = get $url,  'Accept' => 'application/json',  'Authorization' => 'CALiveAPICreator Bzn8jVyfOTiIpW6UQCgy:1';

print "response: ", $response, "\n","\n" ;

# die "Can't get $url -- ", $response, $response->status_line
#	unless defined $response;
