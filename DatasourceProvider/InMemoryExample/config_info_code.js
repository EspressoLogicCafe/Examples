(function () {
	'use strict';
	log.info('DSP:InMemoryExample - config info - begin');

	var configInfo = {};

	configInfo.ui_config = [{
		display: 'BaseKey',
		type: 'string',
		length: 90,
		required: true,
		parameterName: 'inMemoryKey',
		placeholder: 'Enter the key',
		description: 'The key is used to separate the \'globals\' on the server'
	}];

	// Environment variables used in all JS code (e.g., env.jdbcInfo)
	configInfo.env = {
		ConcurrentHashMap: Java.type('java.util.concurrent.ConcurrentHashMap')
	};

	if (log.isDebugEnabled()) {
		log.debug('DSP:InMemoryExample - config info return' + JSON.stringify(configInfo));
	}

	out.println('DSP:InMemoryExample - config info - ' + JSON.stringify(configInfo));

	log.info('DSP:InMemoryExample config info code');

	return configInfo;
})();
