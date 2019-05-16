//arguments are optional - meanings (defaults listed first)
//arg[2] is dbType:       derby or mysql
//arg[3] is server url:    http://localhost:8080/rest/default
//eg: node ./devops/deployprodtests/node/verifySupplier.js http://localhost:8080/rest/default b2bAuth

var apicreator = require('APICreatorSDK');
var connect = require("./connect.js");

var api = connect(   // essentially: return apicreator.connect(urlNwAPI, 'pavlov', 'Password1');
	"Node B2B - verify that Supplier can see *only* their own promotions on APIServer",
	process.argv,
	"pavlov");

try {
	var promosEP = api.endpoint('SupplierInfo');
	promosEP.get('').then(function (data) {
	console.log("..promos:promotions response returned, checking row level security... ");
	// console.log(data);  // lots of output
	var thePromo = data[0];
	if (thePromo.SupplierID == 7) {
		console.log("....Success: SupplierInfo is for Pavlov (7).");
	}
	else {
		console.log("** Expected values not found, thePromo...");
		console.log(thePromo);
	}
	console.log(" ");
	}).catch(
		function (p) {
			console.log("ERROR: API promise throws exception:");
			console.log(p);
			process.exit(1);
		}
	);
}
catch (err) {
	console.log("ERROR: API failed, err..." + err);
	process.exit(1);
}
