(function () {
	'use strict';
	log.info('DSP:InMemoryExample - open begin');

	out.println('DSP:InMemoryExample - open')

	// permit multiple instances of this DSP in different APIs
	var inMemoryKey = settings['inMemoryKey'];

	if (log.isFinestEnabled()) {
		log.finest('InMemoryExample -  inMemoryKey ' + inMemoryKey);
	}

	var apiMap = dspFactory.getAPIGlobalMap();
	var myMap = apiMap.computeIfAbsent(inMemoryKey, function (f) {
		return new env.ConcurrentHashMap();
	});

	// create Task and Person 'tables' if not already done
	var taskMap = myMap.computeIfAbsent('Task', function (f) {
		return new env.ConcurrentHashMap();
	});
	var personMap = myMap.computeIfAbsent('Person', function (f) {
		return new env.ConcurrentHashMap();
	});

	// always keep adding myself back...
	personMap.computeIfAbsent('David', function (personName) {
		'use strict';
		var newRow = new env.ConcurrentHashMap();
		newRow.Name = personName;
		newRow.Number = 24601;
		return newRow;
	});

	taskMap.computeIfAbsent('Honey Dew', function (taskDesc) {
		'use strict';
		var newRow = new env.ConcurrentHashMap();
		newRow.put('Description', taskDesc);
		newRow.put('Who', 'David');
		return newRow;
	});

	out.println(apiMap);

	log.info('DSP:InMemoryExample - open end');
	return null;
})();