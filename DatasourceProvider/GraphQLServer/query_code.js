 (function () {
    'use strict';

    log.info('DSP:GraphQL - query begin');
   
    var fieldList = "";
    var metaEntity = parameters.metaEntity;
    var entityName = metaEntity.entity;
    var entityMetaColumns = metaEntity.getColumns();
    for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
        var metaColumn = entityMetaColumns[idx];
        if (!metaColumn.persistent) {
            continue;
        }
        var column = metaColumn.name;
        fieldList += " " + column ;
    }
   
    var result = parameters.result;
    var payload = {"query": "{ "+entityName+" { "+fieldList +" } }"};
    var graphqlURL = env.GraphSQLEndpoint;
    var settings = env.headers;
    out.println("Begin GraphQL url "+ graphqlURL + " fields: " + JSON.stringify(payload, null, 2));
    var fields = [];
    var graphResult = SysUtility.restPost(graphqlURL, {}, settings, payload);
    out.println(graphResult);
    var query = JSON.parse(graphResult);
   
    if (null !== query.data) {
        var rows = query.data[entityName];
        for (var i = 0 ; i < rows.length; i++) {
             var row = dspFactory.createRow();
             for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
                var metaColumn = entityMetaColumns[idx];
                row[metaColumn.name] =  rows[i][metaColumn.name];
             }
            result.resultData.add(row);
        }
    }
     
 })();
