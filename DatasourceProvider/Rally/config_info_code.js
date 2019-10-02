(function () {
    'use strict';
    print("Begin Rally configInfo code");
    var configInfo = {
        ui_config: [
            {
                display: "API Key",
                type: "string",
                length: 90,
                required: true,
                parameterName: "authtoken",
                placeholder: "Rally API Key (auth Token)",
                description: "Enter the Rally admin  API Key auth token."
            }, {
                display: "Workspace ObjectID",
                type: "string",
                length: 90,
                required: true,
                parameterName: "workspaceID",
                placeholder: "Rally Workspace ObjectID",
                description: "Enter the workspace ObjectID."
            }],
        // Environment variables used in all JS code (e.g., env.jdbcInfo)
        env: {
            System: Java.type("java.lang.System"),
            RestCaller: Java.type("com.kahuna.logic.lib.rest.RestCaller"),
            RallyBaseURL: "https://rally1.rallydev.com/slm/webservice/v2.0",
            RallySchemaURL: "https://rally1.rallydev.com/slm/schema/v2.0/workspace",
            leftQuote: "\"",
            rightQuote: "\""
        }
    }
    print("End Rally configInfo code");
    return configInfo;
})();
