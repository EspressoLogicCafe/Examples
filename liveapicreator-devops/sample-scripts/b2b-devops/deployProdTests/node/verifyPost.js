//arguments are optional - meanings (defaults listed first)
//arg[2] is derby or mysql
//arg[3] is http://localhost:8080/rest/default
//eg: node ./devops/deployprodtests/node/verifyPost.js http://localhost:8080/rest/default b2bderbynw

var apicreator = require('APICreatorSDK');
var connect = require("./connect.js");
var api = connect(   // essentially: return apicreator.connect(url, 'demo', 'Password1');
	"Node B2B - verify that nw:Orders/2000 is found, with proper computed values on APIServer",
	process.argv,
	"demo");
try {
	var ordersEP = api.endpoint('nw:Orders');
	ordersEP.get('sysfilter=equal(OrderID:2000)').then(function (data) {
		console.log("..nw:Orders/2000 response returned, checking computed values... ");
		if (data.length == 0) {
			console.log("** Alert not found - response...");
			console.log(data);
		}
		var theOrder = data[0];
		// console.log(data);  // lots of output
		if (theOrder.AmountTotal == 340.20 && theOrder.discountedAmount == 336.798) {
			console.log("....Success: values are correct - theOrder.AmountTotal == 340.20 && theOrder.discountedAmount == 336.798");
		}
		else {
			console.log("** Expected values not found, theOrder...");
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
