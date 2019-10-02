(function () {
	'use strict';

	log.info('DSP:InMemoryExample - query begin');

	var result = parameters.result;
	var metaEntity = parameters.metaEntity;
	var entityName = metaEntity.entity;
	var pagesize = parameters.pagesize;
	var offset = parameters.offset;
	var inMemoryKey = settings.inMemoryKey;

	out.println('inMemoryKey ' + inMemoryKey);
out.println('pagesize '+pagesize);
out.println('offset ' + pagesize);

	var ArrayList = Java.type('java.util.ArrayList');

	var apiMap = dspFactory.getAPIGlobalMap();

	var myMap = apiMap.computeIfAbsent(inMemoryKey, function (f) {
		// should never happen - open ensures it exists
		out.println('this should not happen');
		return new ConcurrentHashMap();
	});

	var map = myMap.get(entityName);
	if (null === map) {
		throw 'Unable to recognize ' + entityName;
	}

	out.println('got a map ' + map.size());
	// note, these are maps and have NO order - sort the keys alphabetically

	var keys = new ArrayList(map.keySet());
	keys.sort(function (a, b) {
		if (a == b) {
			return 0;
		}
		return a < b ? -1 : 1;
	});

	out.println('keys ' + keys.size());

	var entityMetaColumns = metaEntity.getColumns();

	var numObjects = 0;
	for (var i = 0; i < keys.size(); ++i) {
		var key = keys[i];
		out.println('key = ' + key);

		if (i < offset) {
			continue;
		}

		++numObjects;
		if (numObjects > pagesize) {
			result.moreData = true;
			break;
		}

		out.println('creating a row');
		var row = dspFactory.createRow();

		var mapValue = map[key];
		out.println('mapValue is ' + mapValue);

		// emptiness for now
		for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
			var metaColumn = entityMetaColumns[idx];
			if (!metaColumn.persistent) {
				continue;
			}
			var column = metaColumn.name;
			row[column] = 'foo';
			var theValue = mapValue[column];
			out.println("for " + column + " got " + theValue);
			row[column] = theValue;
		}


		result.resultData.add(row);
	}

	log.info('DSP:InMemoryExample - query end');
})();
