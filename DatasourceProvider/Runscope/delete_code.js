(function () {
    'use strict';

    log.info("End Runscope delete code");
    var runscopeURL = connection.baseURL || "https://api.runscope.com/";
    var auth = connection.auth;
    out.println(runscopeURL);

    var metaEntity = parameters.metaEntity;
    var persistentKey = parameters.persistentKey;

    var entityName = metaEntity.entity;
    var parmValues = [];
    var pkMetaColumns = persistentKey.metaKey.columns;
    var key = [];
    var filterSql = '';
    var logMessage;
    var bucket_id = null;
    var test_id = null;
    var url;

    for (var idx in pkMetaColumns) {
        var metaColumn = pkMetaColumns[idx];
        var column = metaColumn.name;
        parmValues.push({
            metaColumn: metaColumn,
            value: persistentKey.getValueFor(column)
        });
        key.push(persistentKey.getValueFor(column));
        out.println("delete byKey: " + column + " = " + persistentKey.getValueFor(column));
        if ('bucket_id' === column) {
            bucket_id = persistentKey.getValueFor(column);
        }
        if ('steps' === entityName && 'test_id' === column) {
            test_id = persistentKey.getValueFor(column);
        }
    }


    if (key.length === 0) {
        logMessage = "No key was provided for DELETE. Please provide a key in the URL.";
        log.error(logMessage);
        throw new Error(logMessage);
    }

    switch (entityName) {
        default:
            throw "Runcsope Entithy " + entityName + " not configured for byKey";
        case "buckets":
            url = runscopeURL + "buckets/" + key[0];
            break;
        case "teams":
            url = runscopeURL + "teams/" + teamID + "/people";
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


    out.println("delete runscope urtl: " + url);
    var rawDeleteStr = SysUtility.restDelete(url, {}, auth);
    log.debug(rawDeleteStr);
    log.debug("Delete completed successfully");

    if (log.isDebugEnabled()) {
        logMessage = "Runscope - delete - Returned " + rawDeleteStr;
        log.debug(logMessage);
    }

    log.info("End Runscope delete code");
})();
