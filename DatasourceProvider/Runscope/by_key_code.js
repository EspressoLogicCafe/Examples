(function () {
    'use strict';

    log.info('DSP:Runscope - getByKey begin');

    function quoteIdentifier(env, s) {
        return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
    }

    var runscopeURL = connection.baseURL || "https://api.runscope.com/";
    var auth = connection.auth;
    out.println(runscopeURL);
    var result = parameters.result;

    var metaEntity = parameters.metaEntity;
    var entityName = metaEntity.entity;
    var entityMetaColumns = metaEntity.getColumns();
    var persistentKey = parameters.persistentKey;
    var inlineStrategy = parameters.inlineStrategy;
    var pagesize = parameters.pagesize;
    var offset = parameters.offset;
    var bucket_id = null;
    var test_id = null;
    var team_id = null;
    var url;

    var parmValues = [];
    var key = [];
    var pkMetaColumns = persistentKey.metaKey.columns;
    for (var idx in pkMetaColumns) {
        var metaColumn = pkMetaColumns[idx];
        var column = metaColumn.name;
        parmValues.push({
            metaColumn: metaColumn,
            value: persistentKey.getValueFor(column)
        });
        key.push(persistentKey.getValueFor(column));
        out.println("byKey: " + column + " = " + persistentKey.getValueFor(column));
        if ('bucket_id' === column) {
            bucket_id = persistentKey.getValueFor(column);
        }
        if ('test_id' === column) {
            test_id = persistentKey.getValueFor(column);
        }
        if ('team_id' === column) {
            team_id = persistentKey.getValueFor(column);
        }
    }

    // Validation
    if (key && key.length === 0) {
        var errorMessage = "No key was provided to retrieve a single MongoDB object.";
        log.error(errorMessage);
        throw new Error(errorMessage);
    }

    switch (entityName) {
        default:
            throw "Runcsope Entity " + entityName + " not configured for byKey";
        case "buckets":
            url = runscopeURL + "buckets/" + key[0];
            break;
        case "teams":
            url = runscopeURL + "teams/" + key[0] + "/people";
            break;
        case "agents":
            url = runscopeURL + "teams/" + key[0] + "/agents";
            break;
        case "schedules":
            if (null === bucket_id) {
                throw "bucket_id cannot be null";
            }
            if (null === test_id) {
                throw "test_id cannot be null";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/schedules/" + key[0];
            break;
        case "tests":
            if (null === bucket_id) {
                throw "bucket_id cannot be null";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + key[0];
            break;
        case "environments":
            if (null === test_id) {
                throw "test_id cannot be null";
            }
            if (null === bucket_id) {
                throw "bucket_id cannot be null";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/environments/" + key[0];
            break;
        case "steps":
            if (null === test_id) {
                throw "test_id cannot be null";
            }
            if (null === bucket_id) {
                throw "bucket_id cannot be null";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + '/steps/' + key[0];
            break;
    }

    function processRow(thisRow) {

        out.println(JSON.stringify(thisRow, null, 2));
        var row = dspFactory.createRow();
        for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
            var metaColumn = entityMetaColumns[idx];
            if (!metaColumn.persistent) {
                continue;
            }
            var extendedProps = metaColumn.getExtendedProperties();
            var column = metaColumn.name;
            var theValue = thisRow[column];
            if (extendedProps && null !== extendedProps.get("isVirtual")) {
                if (true === extendedProps.get("isVirtual")) {
                    out.println(column + " isVirtual " + extendedProps.get("isVirtual"));
                    //continue;
                }
            }
            out.println("before: " + column + " rawValue: " + theValue + " baseType: " + metaColumn.getBaseType());
            if (theValue && "undefined" !== theValue) {
                theValue = metaColumn.getBaseType().mapValue(theValue);
            }
            if (null !== bucket_id && 'bucket_id' === column) {
                theValue = bucket_id;
            }
            if (null !== test_id && 'test_id' === column) {
                theValue = test_id;
            }
            if (null !== team_id && 'team_id' === column) {
                theValue = team_id;
            }
            out.println("after column:" + column + " mapValue: " + theValue);
            row[column] = theValue;
        }

        //todo add pagesize and offset handler (more rows)
        result.resultData.add(row);
    }

    function processURL(url) {
        out.println("URL " + url);
        var rawRowStr = SysUtility.restGet(url, null, auth);

        var jsonRows = JSON.parse(rawRowStr);
        var data = jsonRows.data;
        // emptiness for now
        if (Array.isArray(data)) {
            for (var idx in data) {
                var thisRow = data[idx];
                processRow(thisRow);
            }
        } else {
            processRow(data);
        }
    }

    //?count="+pagesize+"&offset="+offset
    processURL(url);

    if (log.isDebugEnabled()) {
        var logMessage = 'DSP:Runscope - byKey - Result ' + result;
        log.debug(logMessage);
    }

    log.info('DSP:Runscope - byKey end');
})();
