(function () {
	'use strict';
	log.info('DSP:Rally - open begin');
	var authToken = settings && settings.authtoken || "_qV0sAV9pSi2t7yleIQXlVuRzDlUaUk6B1K84zcI";
	var connection = {
		credentials: "Bearer " + authToken,
		RallyBaseURL: "https://rally1.rallydev.com/slm/webservice/v2.0",
		workspaceID: settings.workspaceID,
		System: Java.type("java.lang.System"),
		RestCaller: Java.type("com.kahuna.logic.lib.rest.RestCaller"),
		HTTPThreadProcessor: Java.type("com.kahuna.server.util.multithreaded.HTTPThreadProcessor"),
		HTTPRequestHolder: Java.type("com.kahuna.server.util.multithreaded.HTTPRequestHolder"),
		HashMap: Java.type("java.util.HashMap"),
		ArrayList: Java.type("java.util.ArrayList"),
		metadata: {}
	};

	log.info('DSP:Rally - open end');
	return connection;
})();
