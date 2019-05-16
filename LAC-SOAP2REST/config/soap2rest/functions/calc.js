var SOAPWebServiceHandler = Java.type("com.ca.soapws.example.SOAPWebServiceHandler");
var response = SOAPWebServiceHandler.calc(parameters.a,parameters.b)
return JSON.parse(response);
