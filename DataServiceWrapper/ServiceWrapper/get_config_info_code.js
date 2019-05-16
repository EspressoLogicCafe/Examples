print("Begin RESTMashUp getConfigInfoCode()");
var configInfo = {};

configInfo.ui_config = [  // system makes values available via settings (e.g, settings.serviceAddress)
    {
		display: "Service Address",
		type: "string",
		length: 90,
		required: true,
		parameterName: "serviceAddress",
		placeholder: "Enter the service address (e.g. http://localhost:8181/rest/default/demo)",
		description: "e.g., http://localhost:8181/rest/default/demo"
	}, {
        display: "Auth Key",
        type: "string",
        length: 100,
        required: true,
        parameterName: "authKey",
        placeholder: "Authorization",
        description: "Authorized Access Key for your REST Swagger (e.g., demo_full for demo)"
    }
];

// Environment
configInfo.env =  {
    System: Java.type("java.lang.System"),
    KahunaException: Java.type("com.kahuna.server.KahunaException"),
};

// Capabilities
configInfo.options = {
    canCommit: false,
    isTabular: true
};

print("END RESTMashUp getConfigInfoCode()");
return configInfo;
