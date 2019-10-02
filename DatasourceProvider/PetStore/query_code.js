(function () {
	'use strict';

	log.info('DSP:PetStore - query begin');

	var result = parameters.result;
	var metaEntity = parameters.metaEntity;
	var entityName = metaEntity.entity;
	var pagesize = parameters.pagesize;
	var offset = parameters.offset;
	var petstoreURL = settings.url || "https://petstore.swagger.io/v2/";

	out.println('pagesize ' + pagesize);
	out.println('offset ' + pagesize);

	var ArrayList = Java.type('java.util.ArrayList');

	var entityMetaColumns = metaEntity.getColumns();

	var numObjects = 0;

	out.println('creating a row');
	var row = dspFactory.createRow();

	var url;
	switch (entityName) {
	default:
		throw "Entity not found";
	case "Pet":
		url = petstoreURL + "pet/findByStatus?status=available";
		break;
	case "User":
		url = petstoreURL + "user/" + (settings.username || "user1");
		break;
	case "Order":
		url = petstoreURL + "store/order/1";
		break;
	}
	// todo Throw an exeception if sorts are called (not supported)
	// to do - filters by id only or specific columns

	function processRow(thisRow) {

		out.println(JSON.stringify(thisRow));
		var row = dspFactory.createRow();
		for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
			var metaColumn = entityMetaColumns[idx];
			if (!metaColumn.persistent) {
				continue;
			}
			var column = metaColumn.name;
			var theValue = thisRow[column];
			out.println("before: " + column + " rawValue: " + theValue + " baseType: " + metaColumn.getBaseType());
			if (theValue) {
				theValue = metaColumn.getBaseType().mapValue(theValue);
				out.println("column:" + column + " mapValue: " + theValue);
				row[column] = theValue;
			}
		}

		//todo add pagesize and offset handler (more rows)
		result.resultData.add(row);
	}

	function processURL(url) {
		out.println("URL " + url);
		var petStoreRows = SysUtility.restGet(url, null, null);

		var jsonRows = JSON.parse(petStoreRows);
		// emptiness for now
		if (Array.isArray(jsonRows)) {
			for (var idx in jsonRows) {
				var thisRow = jsonRows[idx];
				processRow(thisRow);
			}
		}
		else {
			processRow(jsonRows);
		}
	}

	processURL(url);
	// this is the only way to bring back ALL values
	if(entityName === 'Pet') {
		url = petstoreURL + "pet/findByStatus?status=sold";
		processURL(url);
		url = petstoreURL + "pet/findByStatus?status=pending";
		processURL(url);
	}

	log.info('DSP:PetStore - query end');
})();
