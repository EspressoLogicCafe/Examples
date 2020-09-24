(function () {
	log.info('DSP:Salesforce - commit begin');
	if (connection && !connection.isClosed()) {
		try {
			if (log.isFinestEnabled()) {
				log.finest('DSP:JDBCExample - commit - connection: ' + connection);
			}
			connection.commit();
		}
		catch (e) {
			log.error('Commit Connection Error ' + e.message);
			throw e;
		}
	}
	log.info('DSP:Salesforce - commit end');
})();
