#!/usr/bin/php
<?php

$curl = curl_init();
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
	'Accept: application/json',
	'Authorization: CALiveAPICreator Bzn8jVyfOTiIpW6UQCgy:1'
));
$url = computeURL($argv);  # e.g., http://localhost:8080/rest/default/b2bderbynw/v1/Orders/2000
print "\n"."php (using cURL) B2B - verify that nw:Orders/2000 is found, with proper computed values, on ".$url;
curl_setopt($curl, CURLOPT_URL, $url );
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
$response = curl_exec($curl);
$json = json_decode($response, true);  # http://php.net/manual/en/function.json-decode.php

print "\n"."..nw:Orders response returned, checking computed values... ";
$value = $json[0]["AmountTotal"];  # $json[0] is our (only) result row
if ($value == 340.2) {
	print "\n"."....Success"."\n"."\n"."\n";
} else {
	print "\n"."....FAILURE - expected 340.2, but found $value - here's the var_dump(json)"."\n"."\n"."\n";
	var_dump($json);
}
;


function computeURL($argv) { # php ./deployProdTests/php/verify.php http://localhost:8080/rest/default/ b2bAuth
	# var_dump($argv);
	$url = $argv[1].$argv[2]."/v1/nw:Orders/2000";
	return $url;  # ala http://localhost:8080/rest/default/b2bAuth/v1/nw:Orders/2000
}

?>
