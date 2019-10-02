(function () {
	'use strict';

	log.info('DSP:JDBCExample - testConnection begin');
	var startTime = env.System.nanoTime();

	var server = settings && settings.server || 'localhost';
	var database = settings && settings.database || 'dblocal_demo';
	var port = settings && settings.port || 3308;
	var username = settings && settings.username || 'dblocal_demo';
	var password = settings && settings.password;

	var url = env.jdbcInfo + "//" + server + ":" + port + "/" + database +"?sslMode=DISABLED&allowPublicKeyRetrieval=TRUE&disableMariaDbDriver";

	if (log.isFinestEnabled()) {
		applog.finest('JDBCExample - testConnection url ' + url + ' username:' + username);
	}

	try {
		if (env.sqlSelectTest) {
			var sql = env.sqlSelectTest;
			if (log.isFinestEnabled()) {
				log.finest('JDBCExample - Test sql ' + sql);
			}
			var connection = env.DriverManager.getConnection(url, username, password);
			var stmt = connection.createStatement();
			var rs = stmt.executeQuery(sql);
			if (rs.next()) {
				log.debug('DSP:JDBCExample - Test Select ' + rs.getObject(1));
			}
			rs.close();
			stmt.close();
			connection.close();
		}
	}
	catch (e) {
		var result = {};
		log.error('DSP:JDBCExample - testConnection - error:' + e.message);
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
		log.debug('DSP:JDBCExample - testConnection result: ' + resultObj);
	}

	log.info('DSP:JDBCExample - testConnection end');
	return resultObj;
})();
