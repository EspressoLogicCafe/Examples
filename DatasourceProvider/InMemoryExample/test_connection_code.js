(function () {
	'use strict';

	log.info('DSP:InMemoryExample - testConnection begin');

	var status = 'OK';
	var latencyInMillis = 0;

	var resultObj = {
		status: status,
		latency: latencyInMillis
	};

	log.info('DSP:InMemoryExample - testConnection end');
	return resultObj;
})();
