print("Starting FTP listener: " + listener.name);
var camelContext = connection.camelContext;
var URI = connection.connectionURI;
var routeId = listener.name + '_' + new Date().getTime();
/*
* Form URL
*/
var ftpURI = providerUtil.formCamelURI(camelContext, null, URI);
// Add a processor to assign an id. This is required for cluster co ordination.
var messageProcessor = new env.Processor({
    process: function(exchange){
        var message = exchange.getIn();
        var hashString = message.getMessageId();
        exchange.setProperty("uniqueId",hashString);
        exchange.setProperty("clusterSyncOffset",5000);
    }
});

var routeBuilder = new env.RouteBuilder({
    configure: function() {
        var superClass = Java.super(routeBuilder);
        superClass.from(ftpURI)
            .routeId(routeId)
            .process(messageProcessor)
            .bean(messageHandler);
   }
});

try {
    camelContext.addRoutes(routeBuilder);
}
catch(e) {
    throw e;
}
print("Started FTP listener: " + listener.name);
return {
    "camelContext" : camelContext,
    // Useful for stopping listeners.
    "routeId" : routeId
};
