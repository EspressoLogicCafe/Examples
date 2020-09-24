(function () {
	'use strict';

	log.info('DSP:Salesforce - testConnection begin');
	var startTime = env.System.nanoTime();

	var username = settings && settings.username || 'NORTHWIND';
	var password = settings && settings.password;
	var token = settings && settings.token || "";
	var sandboxName = settings && settings.sandboxName || "";

	var url = env.jdbcInfo + "SecurityToken=" + token;
	if(sandboxName && sandboxName.length > 0) {
		url += ";UseSandbox=TRUE";
		url += ";user=" + username + "." + sandboxName;
	}

	if (log.isFinestEnabled()) {
		log.finest('Salesforce - testConnection url ' + url + ' username:' + username);
	}

	try {
		if (env.sqlSelectTest) {
			var sql = env.sqlSelectTest;
			if (log.isFinestEnabled()) {
				log.finest('Salesforce - Test sql ' + sql);
			}
			var connection = env.DriverManager.getConnection(url, username, password);
			var stmt = connection.createStatement();
			var rs = stmt.executeQuery(sql);
			if (rs.next()) {
				log.debug('DSP:Salesforce - Test Select ' + rs.getObject(1));
			}
			rs.close();
			stmt.close();
			connection.close();
		}
	}
	catch (e) {
		var result = {};
		log.error('DSP:Salesforce - testConnection - error:' + e.message);
		result.status = 'NOT OK';
		result.message = e.message;
		return result;
	}

	var endTime = env.System.nanoTime();
	var latencyInMillis = (endTime - startTime) / 100000000;
	var resultObj = {
		status: 'OK',
		latency: latencyInMillis
	};

	if (log.isDebugEnabled()) {
		log.debug('DSP:Salesforce - testConnection result: ' + resultObj);
	}

	log.info('DSP:Salesforce - testConnection end');
	return resultObj;
})();
