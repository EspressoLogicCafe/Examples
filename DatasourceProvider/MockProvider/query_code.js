(function () {
    'use strict';
    log.info("Begin Mock query code");
    var theFilters = [];
    var logMessage;

    if (log.isFinestEnabled()) {
        logMessage = "Mock - Processing filters for getByQuery started";
        log.finest(logMessage);
    }

    var metaEntity = parameters.metaEntity;
    var idValue = null;
    var entityName = metaEntity.entity;
    var entityNameWithPrefix = metaEntity.entityName;

    var pagesize = parameters.pagesize;
    var offset = parameters.offset;

    //convert the result row to baseType
    function formatJson(results, columns) {
        var row = dspFactory.createRow();
        var result = (Array.isArray(results) && results.length > 0) ? results[0] : results;
        var value;
        for (var idx = 0; idx < columns.length; idx++) {
            var column = columns[idx];
            var colname = column && column["name"] || 'unknown';
            var baseType = column.getBaseType();
            var attrTypeName = baseType.getAttrTypeName();
            var generic_type = column.getGenericType();
            if (result && result.hasOwnProperty(colname)) {
                value = result[colname];
                if (null === value) {
                    row[colname] = null;
                    continue;
                }

                switch (generic_type) {
                default:
                case "json":
                    value = JSON.parse(value);
                    break;
                case "object":
                case"collection":
                    if (generic_type && generic_type === 'object'
                        || generic_type === 'collection') {
                        value = baseType.mapValue(value);
                    }
                    break;
                case "double":
                case "string":
                case "integer":
                case "boolean":
                    break;
                case "long":
                    break;
                case "date":
                    break;
                }
                row[colname] = value;
            }
        }
        return row;
    }

    var sysFilters = parameters.filters.sysfilters || [];
    for (var idx = 0; idx < sysFilters.length; ++idx) {
        var thisFilter = sysFilters[idx];
        var filterName = thisFilter.name;
        if (log.isFinestEnabled()) {
            log.finest('FilterName is: ' + filterName);
        }

        //sysFilters.forEach(function (k, v) {
        //for (var i = 0; i < v.size(); i++) {
        for (var paramIdx in thisFilter.columnValueList) {
            var innerJoinPrefix = 0 === paramIdx ? '' : thisFilter.useAndSemantics ? ' and ' : ' or ';

            var param = thisFilter.columnValueList[paramIdx];
            var paramValue = param.value;
            if (paramValue) {
                var key = param.column.name;
                
                switch (filterName) {
                case 'equal' :
                    
                    break;
                case 'notequal' :
                    
                    break;
                case 'greater' :
                    
                    break;
                case 'greaterequal' :
                   
                    break;
                case 'less' :
                    
                    break;
                case 'lessequal' :
                   
                    break;
                case 'like' :
                    
                    break;
                default:
                    // Do nothing?
                }
                //need to add and or or between
            }
        }
    }

    if (log.isFinestEnabled()) {
        log.finest("Mock - Processing filters for getByQuery finished with filters " + JSON.stringify(theFilters));
    }

    // Deal with sorts
    log.finest("Mock - Processing sorts for query started");

    var orders = parameters.orders || [];
    for (var i = 0; i < orders.size(); i++) {
        param = orders[i];
        switch (param.sortAction) {
        case 'asc':
            
            break;
        case 'desc':
            
            break;
        case 'asc_uc':
        case 'asc_lc':
        case 'desc_uc':
        case 'desc_lc':
        case 'null_first':
        case 'null_last':
        default:
            throw 'DSP:Mock cannot does not support the sort action of ' + param.sortAction;

        }
    }

    if (log.isFinestEnabled()) {
        log.finest("Mock - Processing sorts for query finished with sorts " + sortObjs.toString());
    }

    var row = {}; //dspFactory.createRow();
    row = {
        "_id": "5d8950011a0c79717efa678c",
        "accountName": "default TeamSpace",
        "projectName": "API ecqvo",
        "resourceName": "mongo:foo",
        "requestSequenceId": 689,
        "userName": null,
        "userIP": "0:0:0:0:0:0:0:1",
        "entityName": "mongo:foo",
        "datasource": null,
        "oldValue": "{}",
        "newValue": "{\n  \"_id\": \"5d8923dd05de37af6f71215d\",\n  \"num3\": 12345678901234999\n}",
        "actionType": "I",
        "ts": "2019-09-23 19:06:41",
        "pk": "5d8923dd05de37af6f71215d",
        "nestLevel": 1,
        "apiKey": "Admin key",
        "apiVersion": 2002,
        "projectId": 2001,
        "prefix": "mongo"
    };
    var columns = metaEntity.getColumns();
    parameters.result.resultData.add(formatJson(row, columns));
  
    if (log.isDebugEnabled()) {
        logMessage = "Mock - getByQuery - Result " + JSON.stringify(row, null, 2);
        log.debug(logMessage);
    }
})();
