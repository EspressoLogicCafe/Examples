log.info("Begin Amazon DynamoDB getConfigInfoCode()");
var configInfo = {};

configInfo.ui_config = [
    {
        display: "Access Key",
        type: "string",
        length: 100,
        required: true,
        parameterName: "accessKey",
        placeholder: "Enter your Amazon Access Key",
        description: "Authorized Access Key for your DynamoDB Database."
    },
    {
        display: "Secret Key",
        type: "secret",
        length: 100,
        required: true,
        parameterName: "secretKey",
        placeholder: "Enter your Amazon Access Key",
        description: "Secret Key for your DynamoDB Database."
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

log.info("End Amazon DynamoDB getConfigInfoCode()");
return configInfo;
