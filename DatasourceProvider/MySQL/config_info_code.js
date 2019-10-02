(function () {
	'use strict';
	log.info("DSP:JDBCExample - configInfo begin");

	var configInfo = {
		ui_config: [{
			display: "Server",
			type: "string",
			length: 90,
			required: true,
			parameterName: "server",
			placeholder: "Enter the server host name or ip address (e.g. localhost)",
			description: "Name of your server"
		},{
			display: "port",
			type: "number",
			length: 10,
			required: true,
			parameterName: "port",
			placeholder: "Enter the port (e.g 3306)",
			description: "Enter the port for this conneciton"
		}, {
			display: "Database",
			type: "string",
			length: 90,
			required: false,
			parameterName: "database",
			placeholder: "Enter the database/catalog name",
			description: "Enter your database name"
		}, {
			display: "Username",
			type: "string",
			length: 90,
			required: false,
			parameterName: "username",
			placeholder: "Enter the authentication username",
			description: "Authorized Username for your Database"
		}, {
			display: "Password",
			type: "secret",
			length: 90,
			required: true,
			parameterName: "password",
			placeholder: "Enter the password for the database user",
			description: "The password for the database user. Once saved, it is encrypted and can therefore appear longer than expected."
		}],
		// Environment variables used in all JS code (e.g., env.jdbcInfo)
		env: {
			System: Java.type("java.lang.System"),
			DriverManager: Java.type("java.sql.DriverManager"),
			jdbcInfo: "jdbc:mysql:",
			sqlSelectTest: "select 1",
			leftQuote: "`",
			rightQuote: "`"
		}
	};

	if (log.isDebugEnabled()) {
		log.debug("JDBCExample - configInfo return" + JSON.stringify(configInfo));
	}

	log.info("DSP:JDBCExample - configInfo end");

	return configInfo;
})();
