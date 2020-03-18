log.info("Begin Mock configInfoCode()");
var configInfo = {
    ui_config: [{
        display: "Connection String",
        type: "string",
        length: 200,
        required: false,
        parameterName: "connstr",
        placeholder: "Enter the connection string",
        description: "Mock connection strings have the format:<p>"
    }, {
        display: "Endpoint Name",
        type: "string",
        length: 80,
        required: false,
        parameterName: "dbname",
        placeholder: "Enter the database name",
        description: "The name of your Mock endpoint, for instance \"local\""
    }, {
        display: " Collection Name",
        type: "string",
        length: 200,
        required: false,
        parameterName: "amock_collection",
        placeholder: "The name of the collection used to store  records",
        description: "Enter the name of the collection used."
    }, {
        display: "Username",
        type: "string",
        length: 200,
        required: false,
        parameterName: "username",
        placeholder: "Enter the authentication username, if there is one",
        description: "Authorized username for your mock Database, if you are using authentication"
    }, {
        display: "Password",
        type: "string",
        length: 200,
        required: false,
        parameterName: "password",
        placeholder: "The secret password for your MongoDB user",
        description: "Password for your authorized mock Database user."
    }
    ],
    // Environment
    env: {
        System: Java.type("java.lang.System")
    },
    // Capabilities
    options: {
        canCommit: false
    }
};
log.info("End Mock configInfoCode()");

return configInfo;
