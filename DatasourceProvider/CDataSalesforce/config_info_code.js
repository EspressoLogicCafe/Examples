(function () {
	'use strict';
	log.info("DSP:Salesforce - configInfo begin");

	var configInfo = {
		ui_config: [
			{
				display: "Username",
				type: "string",
				length: 90,
				required: true,
				parameterName: "username",
				placeholder: "Enter the authentication username",
				description: "Authorized Username "
			}, {
				display: "Password",
				type: "secret",
				length: 90,
				required: true,
				parameterName: "password",
				placeholder: "Enter the password for the salesforce user",
				description: "The password for the  user. Once saved, it is encrypted and can therefore appear longer than expected."
			}, {
				display: "Security Token",
				type: "string",
				length: 120,
				required: true,
				parameterName: "token",
				placeholder: "Enter the Salesforce security token",
				description: "Salesforce Security Token"
			} , {
				display: "Use Sandbox",
				type: "string",
				length: 100,
				required: false,
				parameterName: "sandboxName",
				placeholder: "Salesforce sandobx name (leave blank if not used)",
				description: "Sandbox Name (leave blank if not used)"
			}
		],
		// Environment variables used in all JS code (e.g., env.jdbcInfo)
		env: {
			System: Java.type("java.lang.System"),
			DriverManager: Java.type("java.sql.DriverManager"),
			jdbcInfo: "jdbc:salesforce:",
			sqlSelectTest: "select * from \"SYS\".\"SYSTABLES\" FETCH FIRST 1 ROWS ONLY",
			leftQuote: "\"",
			rightQuote: "\""
		}
	};

	if (log.isDebugEnabled()) {
		log.debug("DSP:Salesforce - configInfo return" + JSON.stringify(configInfo));
	}

	log.info("DSP:Salesforce - configInfo end");

	return configInfo;
})();
