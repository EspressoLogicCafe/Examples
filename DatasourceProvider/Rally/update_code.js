(function () {
    'use strict';

    function quoteIdentifier(env, s) {
        'use strict';
        return s;
    }

    out.println("DSP Rally update begin");
    log.info('DSP:Rally - update begin');
    var rest = new connection.RestCaller();
    var metaEntity = parameters.metaEntity;
    var persistentKey = parameters.persistentKey;
    var entityName = metaEntity.entity;
    var changeList = parameters.changeList;

    var parmValues = [];


    var updateColumnList = {};
    for (var idx = 0; idx < changeList.length; ++idx) {
        var change = changeList[idx];
        var metaColumn = change.column;
        var newValue = change.value;
        var isReadOnly = metaColumn.isReadOnly;
        if (!metaColumn.persistent) {
            out.println("SKIPPING Not Persistent " + metaColumn.name);
            continue;
        }
        //this seems to be a bug???
        if (metaColumn.isReadOnly) {
            out.println("SKIPPING READ ONLY " + metaColumn.name);
           // continue;
        }

        //if the metaColumn is an object - should we do a lookup?
        //we would need to refetch the object or use the relationship?
        var columnName = metaColumn.name;
        updateColumnList[columnName] = newValue;
    }

    var quotedEntityName = quoteIdentifier(env, entityName);

    var joinPrefix = '';

    var pkMetaColumns = persistentKey.metaKey.columns;

    var objectID = null;
    for (var idx in pkMetaColumns) {
        var metaColumn = pkMetaColumns[idx];
        var column = metaColumn.name;
        objectID = persistentKey.getValueFor(column);
    }


    if (log.isDebugEnabled()) {
        var logMessage = 'Update statement: ' + JSON.stringify(updateColumnList);
        log.debug(logMessage);
    }

    out.println(JSON.stringify(updateColumnList, null, 2));
    var url = connection.RallyBaseURL + "/" + entityName + "/" + objectID;
    out.println("url:" + url + " json: " + JSON.stringify(updateColumnList));
    var json = rest.post(url, {}, {
            headers: {
                Authorization: connection.credentials
            }
        },
        {entityName: updateColumnList}
    );

    out.println("update returned: " + json);

    var res = JSON.parse(json);

    if (res.OperationResult.Errors && res.OperationResult.Errors.length > 0) {
        throw res.OperationResult.Errors[0];
    }

    log.info('DSP:Rally - update end');
})();
