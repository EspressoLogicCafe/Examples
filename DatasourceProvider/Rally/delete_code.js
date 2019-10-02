(function () {
	'use strict';

	function quoteIdentifier(env, s) {
		'use strict';
		return s;
	}
	var rest = new connection.RestCaller();
	log.info("DSP:Rally - delete begin");

	if (log.isDebugEnabled()) {
		var logMessage = "Delete entity " + entityName + "=" + parameters.entityKey;
		log.debug(logMessage);
	}

	var metaEntity = parameters.metaEntity;
	var persistentKey = parameters.persistentKey;

	var entityName = metaEntity.entity;

	var quotedEntityName = quoteIdentifier(env, entityName);

	var joinPrefix = '';

	var parmValues = [];
	var pkMetaColumns = persistentKey.metaKey.columns;

	var filter = "/";
	for (var idx in pkMetaColumns) {
		var metaColumn = pkMetaColumns[idx];
		var column = metaColumn.name;

		var quotedColumn = quoteIdentifier(env, column);
		// filter += joinPrefix + quotedColumn;
		joinPrefix = '/';
		filter += persistentKey.getValueFor(column);

	}

	if (log.isDebugEnabled()) {
		var logMessage = 'Delete  filter' + filter;
		log.debug(logMessage);
	}

	var json = rest.delete(connection.RallyBaseURL + "/" + entityName + filter, {
	}, {
		headers: {
			Authorization: connection.credentials
		}
	});
	out.println("delete returned: " + json);

	var res = JSON.parse(json);
	//var batch = res.BatchResut.Results;
	if (res.OperationResult.Errors.length) {
		throw res.QueryResult.Errors[0];
	}

	var numRows = 1;

	if (0 === numRows) {
		throw "Delete failed : object not found";
	}

	if (numRows > 1) {
		throw "Delete failed : too many objects deleted";
	}

	log.info("DSP:Rally - delete end");
})();
