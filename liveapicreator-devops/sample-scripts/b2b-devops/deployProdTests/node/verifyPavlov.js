// arguments are optional - meanings (defaults listed first)
// arg[2] is server url:    http://localhost:8080/rest/default
// arg[3] is dbType:       b2bderbypavlov
// eg: node ./devops/deployProdTests/node/verifyPavlov.js http://localhost:8080/rest/default b2bderbypavlov

var apicreator = require('APICreatorSDK');
var connect = require("./connect.js");

var api = connect(   // essentially: return apicreator.connect(urlPavlovAPI, 'demo', 'Password1');
	"Node B2B - verify that Pavlov received alert on ApiServer",
	process.argv,
	"demo");

try {
	var ordersEP = api.endpoint('main:PARTNERORDERS');
	ordersEP.get('').then(function (data) {
		console.log("..PartnerOrders response returned data, checking custName... ");
		// console.log(data);  // lots of output
		if (data.length == 0) {
			console.log("** Alert not found - response...");
			console.log(data);
		}
		var theOrder = data[0];
		if (theOrder.CUSTNAME == "Vins et alcools Chevalier") {
			console.log("....Success: values are correct - found Pavlov's alert for 'Vins et alcools Chevalier'...");
		}
		else {
			console.log("** Expected values not found, order from alert...");
			console.log(theOrder);
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
