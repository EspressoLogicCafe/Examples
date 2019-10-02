log.info("Begin Petstore invoke");
var logMessage = "";

// Invoke a function
var petstoreURL = settings.url || "https://petstore.swagger.io/v2/";

out.println("petstore invoke " + procedure_name);
var procArgs = procEntity.getArgs();

if (log.isFinestEnabled()) {
	logMessage = "PetStore - Procedure " + procedure_name;
	log.finest(logMessage);
}


var status = "available";
var url;
var petStoreRows;
switch (procedure_name) {
default:
	throw "Procedure not found";
case "pet_findByStatus":
	try {
		out.println(payload);
		var jsonStatus = JSON.parse(payload);
		status = jsonStatus["status"];
		out.println("Status found in payload " + status);
	}
	catch (E) {
		out.println(E);
	}
	url = petstoreURL + "pet/findByStatus?status=" + status;
	petStoreRows = SysUtility.restGet(url, null, null);
	break;
case "store_inventory":
	url = petstoreURL + "store/inventory";
	petStoreRows = SysUtility.restGet(url, null, null);
	break;
case "store_order":
	url = petstoreURL + "store/order";
	petStoreRows = SysUtility.restPost(url, null, null, payload);
	break;
}

out.println("Result: " + petStoreRows);

var result = petStoreRows;

if (log.isDebugEnabled()) {
	logMessage = "PetStore - invoke with result " + result;
	log.debug(logMessage);
}

log.info("End PetStore invoke");
return result;
