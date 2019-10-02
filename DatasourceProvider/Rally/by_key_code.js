(function () {
    'use strict';

    log.info('DSP:Rally - getByKey begin');

    function quoteIdentifier(env, s) {
        'use strict';
        return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
    }

    var result = parameters.result;
    var rest = new connection.RestCaller();
    var metaEntity = parameters.metaEntity;
    var persistentKey = parameters.persistentKey;
    var inlineStrategy = parameters.inlineStrategy;

    var JavaSqlTypes = Java.type('java.sql.Types');

    var entityName = metaEntity.entity;

    var sep = '';
    var selectColumnList = '';
    var entityMetaColumns = metaEntity.getColumns();
    var foo = "";
    for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
        var metaColumn = entityMetaColumns[idx];
        if (!metaColumn.persistent) {
            continue;
        }
        var column = metaColumn.name;
        // need to fix column name to database specs - different for each database
        selectColumnList += sep + column;
        sep = '%2C'; //comma
    }

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
    function processRow(thisRow) {
        out.println("process thisRow:" + JSON.stringify(thisRow));

        entityMetaColumns = metaEntity.getColumns();
        var row = dspFactory.createRow();
        for (var idx in entityMetaColumns) {
            var metaColumn = entityMetaColumns[idx];

            var column = metaColumn.name;
            var theValue = thisRow[column];
            if (!metaColumn.persistent) {
                continue;
            }
            if (theValue) {
                if ("object" === (typeof theValue)) {
                    // theValue = metaColumn.getBaseType().mapValue(JSON.stringify(theValue));
                    // row[column] = theValue;
                    var link = theValue["_ref"];
                    var type = theValue["_type"];
                    var idx = link.lastIndexOf("/");
                    if (idx > 5) {
                        link = link.substring(idx + 1);
                    }
                    out.println("column: " + column + " baseType: " + metaColumn.getBaseType() + " +link: " + link);
                    row[column] = link;
                } else {
                    theValue = metaColumn.getBaseType().mapValue(theValue);
                    out.println("   mapValue: " + theValue);
                    row[column] = theValue;
                }
            }
        }
        result.resultData.add(row);
    }

    filter += "?fetch=true";//+ selectColumnList;
    out.println("byKey entityName "+ entityName);
    var url = connection.RallyBaseURL;
    url += "/" ;
    url += entityName;
    url += filter;
    out.println("byKey URL: " + url);
    
    var json = rest.get(url, {
    }, {
        headers: {
            Authorization: connection.credentials
        }
    });
    out.println("byKey request found: " + json);

    if (log.isDebugEnabled()) {
        var logMessage = 'JSON byKey Query: ' + json;
        log.debug(logMessage);
    }


    var res = JSON.parse(json);
    var thisRow;
    if(res.hasOwnProperty("QueryResult")) {
        thisRow = res.QueryResult.Results;
    } else if(res.hasOwnProperty("OperationResult")) {
        thisRow = res.OperationResult;
    }
    else {
         thisRow = res[entityName];
    }
    if (thisRow.Errors && thisRow.Errors.length > 0) {
        log.error("Error returning byKey row  " + thisRow.Errors[0]);
        throw thisRow.Errors[0];
    }
    processRow(thisRow);

    if (log.isDebugEnabled()) {
        var logMessage = 'DSP:Rally - byKey - Result ' + result;
        log.debug(logMessage);
    }

    log.info('DSP:Rally - byKey end');
})();
