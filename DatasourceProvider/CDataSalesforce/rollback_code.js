(function () {
	log.info('DSP:Salesforce - rollback begin');

	if (connection && !connection.isClosed()) {
		try {
			if (log.isFinestEnabled()) {
				log.finest('DSP:Salesforce - Connection: ' + connection);
			}

			connection.rollback();
		}
		catch (e) {
			log.error('Rollback Error ' + e.message);
			throw e;
		}
	}

	log.info('DSP:Salesforce - rollback end');
})();
