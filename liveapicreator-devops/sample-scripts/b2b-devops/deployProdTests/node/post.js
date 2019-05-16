// arguments are optional - meanings (defaults listed first)
// arg[2] is derby or mysql
// arg[3] is http://localhost:8080/rest/default
// eg: node ./devops/deployprodtests/node/post.js http://localhost:8080/rest/default b2bAuth

var apicreator = require('APICreatorSDK');
var connect = require("./connect.js");

// essentially: return apicreator.connect(urlNwAPI, 'demo', 'Password1');
var api = connect(
	"B2B - post order and items on APIServer",
	process.argv,
	"demo"
);

var newPartnerOrderJson = {
		"CustomerNumber": "VINET",
		"Items": [
			{
				"Product": {
					"@metadata": {
						"action": "LOOKUP",
						"key": "ProductName"
					},
					"ProductName": "Pavlova"
				},
				"Quantity": 1
			},
			{
				"Product": {
					"@metadata": {
						"action": "LOOKUP",
						"key": "ProductName"
					},
					"ProductName": "Uncle Bob's Organic Dried Pears"
				},
				"Quantity": 2
			},
			{
				"Product": {
					"@metadata": {
						"action": "LOOKUP",
						"key": "ProductName"
					},
					"ProductName": "Tofu"
				},
				"Quantity": 3
			},
			{
				"Product": {
					"@metadata": {
						"action": "LOOKUP",
						"key": "ProductName"
					},
					"ProductName": "Ikura"
				},
				"Quantity": 4
			},
			{
				"Product": {
					"@metadata": {
						"action": "LOOKUP",
						"key": "ProductName"
					},
					"ProductName": "Konbu"
				},
				"Quantity": 5
			},
			{
				"Product": {
					"@metadata": {
						"action": "LOOKUP",
						"key": "ProductName"
					},
					"ProductName": "Alice Mutton"
				},
				"Quantity": 1
			}
		],
		"Shipper": {
			"@metadata": {
				"action": "LOOKUP",
				"key": "CompanyName"
			},
			"CompanyName": "Federal Shipping"
		}
	}
;

var partnerOrderEP = api.endpoint('PartnerOrder');
console.log("B2B - posting...");

try {
	var newPartnerOrder = partnerOrderEP.post(newPartnerOrderJson);
	newPartnerOrder.then(function (txSummary) {
		console.log(".. request completed with statusCode: " + txSummary.statusCode);
		var OrderNumber = 0;
		if (txSummary.statusCode == 201) {
			var theUpdates = txSummary.txsummary;
			// console.log(theUpdates);
			for (var eachRowNum = 0; eachRowNum < theUpdates.length; eachRowNum++) {
				var eachUpdatedRow = theUpdates[eachRowNum];
				// eachUpdateRow.@metadata is bad JavaScript syntax
				var metaData = eachUpdatedRow['@metadata'];
				var rowType = metaData.resource;
				if (rowType == 'PartnerOrder') {
					OrderNumber = eachUpdatedRow.OrderNumber;
					console.log('....OrderNumber: ' + OrderNumber);
					// console.log(eachUpdatedRow);
				}
			}
		}
		else {
			console.log("ERROR: Post txSummary did not find expected 201...");
			console.log(txSummary); //an object which will include a transaction summary and a summary of the rules fired during this request
			process.exit(1);
		}
		console.log(" ");
	}).catch(
		function (p) {
			console.log("ERROR: Post promise throws exception:");
			console.log(p);
			process.exit(1);
		}
	)
}
catch (err) {
	console.log("ERROR: Post failed, err..." + err);
	process.exit(1);
}
