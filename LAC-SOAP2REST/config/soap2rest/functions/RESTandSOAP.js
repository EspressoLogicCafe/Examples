print("START::"+new Date());
var response = {};
//REST Endpoint Called 5 times
for (i = 0; i < 5; i++) {
    var restResponse =  SysUtility.restGet("http://services.groupkt.com/country/get/all", null, null);
    response["Rs"+i+""]=JSON.parse(restResponse);
}
//SOAP Endpoint Called 5 times with different inputs.
for (j = 0; j < 5; j++) {
    var SOAPWebServiceHandler = Java.type("com.ca.soapws.example.SOAPWebServiceHandler");
    b = Math.floor(Math.random() * 10) + 1;
    a = Math.floor(Math.random() * 10)*b;
    var restResponse = SOAPWebServiceHandler.calc(a,b)
    key = a+":calc:"+b;
    response[key]=JSON.parse(restResponse);
}
print("END::"+new Date());
return response;
