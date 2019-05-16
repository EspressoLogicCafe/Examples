var apicreator = require('APICreatorSDK');

//$cmdLineArgs are optional - meanings (defaults listed first)
// arg[2] is derby or mysql
// arg[3] is http://localhost:8080/rest/default
//eg: node ./scs/projects/test/node/verifyPavlov.js derby http://localhost:8080/rest/default

//compute url such as http://localhost:8080/rest/default/b2bderbynw/v1
// eg...

//
// var api = connect.connect(
//                   "Node B2B - verify that Pavlov received alert on ApiServer",
//                   process.argv,  -- this contains $APIFullURL ${ExportAPI}
// xxx                  "pavlov",
//                   "demo");

function connect($title, $cmdLineArgs, $userName) { // api, url like http://localhost:8080/rest/default/

	var db = false;
	if ($cmdLineArgs.length < 3)
		throw Error("Args required (eg, http://localhost:8080/rest/default/, b2bAuth");

	var api = $cmdLineArgs[3]                                        // allow for mysql

	var server = $cmdLineArgs[2];  // allow for different server (war file, docker, etc)
	if (server.charAt(server.length - 1) != "/") {
		server = server + "/";
	}

	var url = server + api + "/v1";

	console.log(" ");
	console.log($title + " -- server: " + url);
	if (db) {
		console.log("**** Connect ... for user: " + $userName);
		console.log(".. $cmdLineArgs[2]=" + $cmdLineArgs[2]);  // eg, http://localhost:8080/rest/default/
		console.log(".. $cmdLineArgs[3]=" + $cmdLineArgs[3]);  // eg b2bAuth
	}

	var userName = $userName || 'demo;'

	var apiConnect = apicreator.connect(url, userName, 'Password1');
	if (db) {
		console.log(".. apiConnect( url=" + url + ", userName=" + userName + ") returns: " + apiConnect);
	}
	return apiConnect;
}

module.exports = connect;
