log.info('DSP:Salesforce - open begin');

// the config_info_code.js defined the variable names below:
var username = settings && settings.username || 'testUser';
var password = settings && settings.password || "";
var token = settings && settings.token || "";
var sandboxName = settings && settings.sandboxName || "";

var url = env.jdbcInfo + "SecurityToken=" + token;
if(sandboxName && sandboxName.length > 0) {
	url += ";UseSandbox=TRUE";
	url += ";user=" + username + "." + sandboxName;
}
//var url = uri + hostname + ":" + port +"/" + databaseName; // use this for most JDBC database connections
if (log.isFinestEnabled()) {
	log.finest('JDBCExample -  URL ' + url);
}

var connection = env.DriverManager.getConnection(url, username, password);
connection.setAutoCommit(false); //required by LAC

log.info('DSP:Salesforce - open end');
return connection;
