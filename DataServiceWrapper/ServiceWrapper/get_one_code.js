print("\nBegin RESTMashUp getByKey - entityName: " + entityName + ", parameters: " + parameters);

var RestCaller = Java.type("com.kahuna.logic.lib.rest.RestCaller");
var restCaller = new RestCaller(); 
var serviceAddress = connection && connection.serviceAddress || "http://localhost:8080/rest/default/demo";
var url = serviceAddress + "/v1/"+entityName + "/" + key[0];
url = encodeURI(url)
var response = restCaller.get(url, null, connection.auth);

print("End RESTMashUp getByquery on entity: " + entityName + ", responseObj\n" +response);
return response;
