// arguments are optional - meanings (defaults listed first)
// arg[2] is derby or mysql
// arg[3] is http://localhost:8080/rest/default
// eg, from b2b folder: node ./devops/deployprodtests/node/testB2BAll.js http://localhost:8080/rest/default b2bAuth


var apicreator = require('APICreatorSDK');
var connect = require("./connect.js");

// essentially: return apicreator.connect(urlNwAPI, 'demo', 'Password1');
var api = connect(
	"B2B - run set of tests in function testB2BAll",
	process.argv,
	"demo"
);

var empsEP = api.endpoint('testB2BAll');
// console.log("got EP");

try {
	empsEP.get().then(function (data) {
		// console.log("..testB2BALl returned, checking response... " + JSON.stringify(data));
		if (data.length == 0) {
			console.log("** Alert not found - response...");
			console.log(data);
		}
		var result = data.Result;
		console.log("..got data.Result: " + result);
		if (result !== "Success") {
			console.log("ERROR: result not successful: " + result);
			process.exit(1);
		}
		console.log("....Success");
	});
}
catch (err) {
	console.log("ERROR: function failed, err..." + err);
	process.exit(1);
}
