(function () {
	'use strict';
	log.info("DSP:CSV - configInfo begin");

	var configInfo = {
		ui_config: [{
			display: "Directory",
			type: "string",
			length: 90,
			required: true,
			parameterName: "directory",
			placeholder: "Enter the directory for the location of your CSV/TSV files",
			description: "Directory path"
		}, {
			display: "Delimeter",
			type: "string",
			length: 90,
			required: false,
			parameterName: "delimeter",
			placeholder: "Enter the delimeter type",
			description: "CSVDelimited or TABDelimited"
		}, {
			display: "Header Included",
			type: "boolean",
			length: 90,
			required: true,
			parameterName: "hasHeader",
			placeholder: "Is the header included in first line",
			description: "Header included in first line"
		}
		],
		// Environment variables used in all JS code (e.g., env.jdbcInfo)
		env: {
			System: Java.type("java.lang.System"),
			DriverManager: Java.type("java.sql.DriverManager"),
			jdbcInfo: "cdata:csv:",
			sqlSelectTest: "select * from \"SYS\".\"SYSTABLES\" FETCH FIRST 1 ROWS ONLY",
			leftQuote: "\"",
			rightQuote: "\""
		}
	};

	if (log.isDebugEnabled()) {
		log.debug("JDBCExample - configInfo return" + JSON.stringify(configInfo));
	}

	log.info("DSP:JDBCExample - configInfo end");

	return configInfo;
})();
