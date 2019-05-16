print("\nBegin RESTMashup configure_code with settings:" + settings.toString());
var authKey = settings && settings.authKey || "demo_full";
// print("authKey: " + authKey);

//var settings = settings.authKey;
var conn = {};
conn.auth = { headers: { Authorization: "CALiveAPICreator " + authKey + ":1" }};
conn.serviceAddress = settings && settings.serviceAddress || "http://localhost:8080/rest/default/demo";

print("End RESTMashup configure_code with conn: " + JSON.stringify(conn));
return conn;
