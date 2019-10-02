log.info('DSP:JDBCExample - configure begin');

// the config_info_code.js defined the variable names below:

	var server = settings && settings.server || 'localhost';
	var database = settings && settings.database || 'dblocal_demo';
	var port = settings && settings.port || 3308;
	var username = settings && settings.username || 'dblocal_demo';
	var password = settings && settings.password;

	var url = env.jdbcInfo + "//" + server + ":" + port + "/" + database +"?sslMode=DISABLED&allowPublicKeyRetrieval=TRUE&disableMariaDbDriver&noDatetimeStringSync=true";
out.println('dsp url is ' + url);
if (log.isFinestEnabled()) {
	applog.finest('JDBCExample -  URL ' + url);
}

var connection = env.DriverManager.getConnection(url, username, password);
connection.setAutoCommit(false); //required by LAC

log.info('DSP:JDBCExample - configure end');
return connection;
