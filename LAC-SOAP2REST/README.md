# LAC-SOAP2REST

This API example demonstrates how you can convert a SOAP endpoint to a REST endpoint using Live API Creator. It attempts to use the http://www.dneonline.com/calculator.asmx?WSDL Web Based SOAP Service. This API example works with Live API Creator 5.0. Refer to **Function calc**.

It further provides an example that demonstrates how a response from a REST endpoint and SOAP endpoint can be eaisly combined together. Refer to **Function RESTandSOAP**.

The code for this API example is located in the java/src directory. The code demonstrates the following:

 - How Live API Creator generates the stubs for the SOAP service.
 
 - How Live API Creator accesses the remote service using the SOAPWebServiceHandler.java interface class. Live API Creator converts the API into the soap.jar JAR file. You call the SOAP service using this file in API Creator.

### Install the API Example

1. Copy the jar files that are in the lib directory of your Live API Creator instance.
2. Restart API Server.
3. Log in to API Creator.
4. Import the config/SOAP2REST.zip ZIP file.
A new API is created.

### Use the API Example to Convert a SOAP Endpoint to a REST Endpoint

1. With the API open, in the **Execute** section, click **REST Lab**.
2. Select the **Function** endpoint.
3. Select the **calc** function.
4. Enter http://localhost:8080/rest/default/soap2rest/v1/calc?a=10&b=2 as the URL for the function, and then send your request by clicking GET.
The SOAP endpoint is converted to a REST endpoint.
