print("Starting a FTP connection: " + connection.name);
var context = new env.DefaultCamelContext();
context.setName("Context_" + connection.name);

var port = parameters.port || 21; 
var directoryName = parameters.directoryName || '';

var ftpComponent = new env.FtpComponent();
// Set component properties
var componentProperties = parameters["componentProperties"];

for (var key in componentProperties) {
    var methodName = "set" + key.charAt(0).toUpperCase() + key.substring(1);
    ftpComponent[methodName](componentProperties[key]);
}
// Add the component to the context.
context.addComponent("ftp", ftpComponent);
// Form URL from parameters
var ftpURI = providerUtil.formCamelURI(context, "ftp", "//"+parameters.host + ":" + port + "/" + directoryName);

context.start();

return {
    camelContext: context,
    startupEnv: env,
    connectionName: connection.name,
    connectionURI : ftpURI
};
