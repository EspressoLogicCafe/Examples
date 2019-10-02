(function () {
    'use strict';

    function quoteIdentifier(env, s) {
        'use strict';
        return s;
    }
    out.println("DSP Rally insert begin");
    log.info('DSP:Rally - insert begin');
    var rest = new connection.RestCaller();
    var metaEntity = parameters.metaEntity;
    var entityName = metaEntity.entity;
    var bean = parameters.bean;
    var payload = {};
    var entityMetaColumns = metaEntity.getColumns();
    for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
        var metaColumn = entityMetaColumns[idx];
        if (!metaColumn.persistent) {
            continue;
        }

        if (metaColumn.readOnly) {
            continue;
        }

        var columnName = metaColumn.name;
        var value = bean.getValue(columnName);
        if (null !== value) {
            payload[columnName] = metaColumn.getBaseType().mapValue(value);
        }
    }

    var quotedEntityName = quoteIdentifier(env, entityName);

    if (log.isDebugEnabled()) {
        var logMessage = 'insert statement: ' + JSON.stringify(payload);
        log.debug(logMessage);
    }

    out.println(JSON.stringify(payload, null, 2));
    var url = connection.RallyBaseURL + "/" + entityName + "/create";
    out.println("insert url: "+ url);
    var json = rest.post(url, {}, {
            headers: {
                Authorization: connection.credentials
            }
        },
        { entityName: payload }
    );

    out.println("insert returned: " + json);

    var res = JSON.parse(json);

    if (res.CreateResult.Errors && res.CreateResult.Errors.length > 0) {
        throw res.CreateResult.Errors[0];
    }

    log.info('DSP:Rally - insert end');
})();
