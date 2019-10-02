(function () {
    'use strict';

    log.info('DSP:Runscope - query begin');

    var result = parameters.result;
    var metaEntity = parameters.metaEntity;
    var entityName = metaEntity.entity;
    var pagesize = parameters.pagesize;
    var offset = parameters.offset;
    var runscopeURL = connection.baseURL || "https://api.runscope.com/";
    var auth = connection.auth;
    out.println(runscopeURL);

    function quoteIdentifier(env, s) {
        return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
    }

    out.println('pagesize ' + pagesize);
    out.println('offset ' + pagesize);

    var ArrayList = Java.type('java.util.ArrayList');
    var entityMetaColumns = metaEntity.getColumns();
    var bean = parameters.bean;
    var numObjects = 0;
    var filterSql = '';
    var joinPrefix = '';
    var order = '';
    var parmValues = [];
    var bucket_id = null;
    var test_id = null;
    var team_id = null;

    function convertArray(value) {
        var arr = [];
        var classTypeName = value && value.getClass().getName() || 'null';
        switch (classTypeName) {
            default:
                return value;
            case 'java.util.ArrayList':
            case 'java.util.Vector':
                for (var i = 0; i < value.size(); i++) {
                    var val = value[i];
                    if ('object' === typeof val) {
                        val = convertArray(val);
                    }
                    arr.push(val);
                }
                break;
            case 'java.util.LinkedHashMap':
            case 'java.util.HashMap':
                var result = {};
                for (var key in value) {
                    var val = value[key];
                    if ('object' === typeof val) {
                        val = convertArray(val);
                    }
                    result[key] = val;
                }
                return result;
        }
        return arr;
    }

    out.println('creating a row');
    var row = dspFactory.createRow();
    var url;
    bucket_id = bean.getValue("bucket_id");
    test_id = bean.getValue("test_id");
    var teamID = bean.getValue("team_iod");
    switch (entityName) {
        default:
            throw "Runcsope Entity " + entityName + " not configured";
        case "account":
            url = runscopeURL + "account";
            break;
        case "teams":
            url = runscopeURL + "teams/" + teamID + "/people";
            break;
        case "buckets":
            throw "use create-bucket function";
        case "tests":
            throw "use create-test function";
        case "environments":
            if (null === test_id) {
                throw "test_id cannot be null";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/environments";
            break;
        case "steps":
            throw "use create-step function";
        case "schedules":
             throw "use create-schedule function";
            
    }
    out.println("post url: " + url);

    var parms = [];
    var generatedNames = [];
    var payload = dspFactory.createRow();
    for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
        var metaColumn = entityMetaColumns[idx];
        if (!metaColumn.persistent) {
            continue;
        }

        if (metaColumn.readOnly) {
            continue;
        }
        var column = metaColumn.name;
        var columnName = metaColumn.name;
        var theValue = null;
        var newValue = bean.getValue(columnName);

        var extendedProps = metaColumn.getExtendedProperties();
        if (extendedProps && null !== extendedProps.get("isVirtual")) {
            if (true === extendedProps.get("isVirtual")) {
                out.println(column + " isVirtual " + extendedProps.get("isVirtual"));
                if ("bucket_id" === columnName) {
                    bucket_id = newValue;
                }
                if ("test_id" === columnName) {
                    test_id = newValue;
                }
                continue;
            }
        }
        // if (newValue && null !== newValue) {
        var value = metaColumn.getBaseType().mapValue(newValue);
        out.println(columnName + ":" + value);
        if ('object' === typeof value) {
            payload[metaColumn.name] = convertArray(value);
        } else {
            payload[metaColumn.name] = value;
        }
        //}
    }
    var data = JSON.stringify(payload, null, 2);
    out.println("payload:" + data);
    var insertStr = SysUtility.restPost(url, {}, auth, data);
    out.println("INSERT Response: " + insertStr);

    if (insertStr) {
        var json = JSON.parse(insertStr);
        var resultData = json.data;
        out.println("Result Data " + JSON.stringify(resultData, null, 2));
        for (idx = 0; idx < entityMetaColumns.length; ++idx) {
            metaColumn = entityMetaColumns[idx];
            columnName = metaColumn.name;
            var value = resultData[columnName];
            var mappedValue = metaColumn.baseType.mapValue(value);
            bean.setValue(columnName, mappedValue);
        }
        
        if (null !== bucket_id) {
            bean.setValue("bucket_id", bucket_id);
        }
    }
    log.info("response row:" + bean);
    log.info('DSP:Runscope insert - end');
})();
