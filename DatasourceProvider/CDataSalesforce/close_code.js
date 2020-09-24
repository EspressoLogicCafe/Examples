(function () {
	log.info('DSP:Salesforce - close begin');
	if (connection && !connection.isClosed()) {
		try {
			if (log.isFinestEnabled()) {
				log.finest('DSP:Salesforce - close: ' + connection);
			}
			connection.close();
		}
		catch (e) {
			log.error('DSP:Salesforce - close error ' + e.message);
			throw e;
		}
	}
	log.info('DSP:Salesforce - close end');
})();
