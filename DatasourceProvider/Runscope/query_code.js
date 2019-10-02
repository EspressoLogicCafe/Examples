(function () {
    'use strict';

    log.debug('DSP:Runscope - query begin');
    out.println("QUERY");
    var result = parameters.result;
    var metaEntity = parameters.metaEntity;
    var entityName = metaEntity.entity;
    var pagesize = parameters.pagesize;
    var offset = parameters.offset;
    var runscopeURL = settings.baseURL || "https://api.runscope.com/";
    var access_token = settings.access_token || "33063bce-285e-4c86-844e-9de088f6a280";

    var auth = {
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        }
    };

    function quoteIdentifier(env, s) {
        return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
    }

    var ArrayList = Java.type('java.util.ArrayList');
    var entityMetaColumns = metaEntity.getColumns();
    var numObjects = 0;
    var filterSql = '';
    var joinPrefix = '';
    var order = '';
    var parmValues = [];
    var bucket_id = null;
    var test_id = null;
    var team_id = null;
    var sysFilters = parameters.filters.sysfilters || [];
    for (var idx = 0; idx < sysFilters.length; ++idx) {
        var thisFilter = sysFilters[idx];
        var filterName = thisFilter.name;

        if (log.isFinestEnabled()) {
            log.finest('FilterName is: ' + filterName);
        }

        var argHolder;
        var nameTransform;
        if (thisFilter.useUpper) {
            argHolder = 'upper(?)';
            nameTransform = function (s) {
                return 'upper(' + s + ')';
            };
        } else if (thisFilter.useLower) {
            argHolder = 'lower(?)';
            nameTransform = function (s) {
                return 'lower(' + s + ')';
            };
        } else {
            argHolder = '?';
            nameTransform = function (s) {
                return s;
            };
        }

        var filterType;
        var filterTypeNull;
        switch (filterName) {
            case 'equal':
                filterType = ' = ' + argHolder;
                filterTypeNull = ' is null';
                break;
            default:
                throw 'Unhandled filterSql ' + filterName;
        }

        var subfilter = '';
        for (var paramIdx in thisFilter.columnValueList) {
            var innerJoinPrefix = 0 === paramIdx ? '' : thisFilter.useAndSemantics ? ' and ' : ' or ';

            var param = thisFilter.columnValueList[paramIdx];
            var metaColumn = param.column;
            if (!metaColumn.persistent) {
                throw 'Cannot filter ' + entityNameWithPrefix + ' using non-persistent attribute ' + metaColumn.name;
            }
            var value = param.value;
            if (log.isFinestEnabled()) {
                log.finest('   Param: ' + metaColumn.name);
            }

            if (null === param.value) {
                if (null == filterTypeNull) {
                    throw 'Cannot use null as value for ' + filterName;
                }
                subfilter += innerJoinPrefix + nameTransform(quoteIdentifier(env, metaColumn.name)) + filterTypeNull;
            } else {
                subfilter += innerJoinPrefix + nameTransform(quoteIdentifier(env, metaColumn.name)) + filterType;
                parmValues.push({
                    metaColumn: metaColumn,
                    value: value
                });
                if (metaColumn.name === 'test_id') {
                    test_id = value;
                }
                if (metaColumn.name === 'bucket_id') {
                    bucket_id = value;
                }
                if (metaColumn.name === 'team_id') {
                    team_id = value;
                }
                if("teams" === entityName && metaColumn.name === 'id') {
                    team_id = value;
                }
            }
        }

        filterSql += joinPrefix + '(' + subfilter + ')';
        joinPrefix = '\n   and '
    }
  
    if ('' === filterSql) {
        filterSql = '1 = 1';
    }

    var row = dspFactory.createRow();
    var url;
    switch (entityName) {
        default:
            throw "Runcsope Entity " + entityName + " not configured";
        case "agents":
            if (null === team_id) {
                throw "team_id cannot be null, use sysfilter=equal(team_id,'xxx')";
            }
            url = runscopeURL + "teams/" + team_id + "/agents";
            break;
        case "account":
            url = runscopeURL + "account";
            break;
        case "regions":
            url = runscopeURL + "regions";
            break;
        case "buckets":
            url = runscopeURL + "buckets";
            break;
        case "tests":
            if (null === bucket_id) {
                throw "bucket_id cannot be null, use sysfilter=equal(bucket_id,'xxx')";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests";
             if(pagesize > 0) {
                url += "?count=" + pagesize;
                if (offset > 0 ) {
                    url += "&offset="+offset;
                }
            } 
            else {
                if (offset > 0 ) {
                    url += "?offset="+offset;
                }
            }
            break;
        case "schedules":
            if (null === bucket_id) {
                throw "bucket_id cannot be null, sysfilter=equal(bucket_id,'xxx')";
            }
            if (null === test_id) {
                throw "test_id cannot be null";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/schedules";
            break;
        case "environments":
            if (null === bucket_id) {
                throw "bucket_id cannot be null, use sysfilter=equal(bucket_id,'xxx')";
            }
            if (null === test_id) {
                throw "test_id cannot be null use sysfilter=equal(test_id:'xxx')";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/environments";
            break;
        case "steps":
            if (null === test_id) {
                throw "test_id cannot be null use sysfilter=equal(test_id:'xxx')";
            }
            if (null === bucket_id) {
                throw "bucket_id cannot be null, use sysfilter=equal(bucket_id,'xxx')";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + '/steps';
            break;
        case "results":
            if (null === test_id) {
                throw "test_id cannot be null use sysfilter=equal(test_id:'xxx')";
            }
            if (null === bucket_id) {
                throw "bucket_id cannot be null, use sysfilter=equal(bucket_id,'xxx')";
            }
            url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + '/results/latest';
            break;
        case "teams":
            if (null === team_id) {
                throw "team_id cannot be null, use sysfilter=equal(team_id:'xxx')";
            }
            url = runscopeURL + "teams/" + team_id + "/people";
            break;
        case "integrations":
            if (null === team_id) {
                throw "team_id cannot be null, use sysfilter=equal(team_id:'xxx')";
            }
            url = runscopeURL + "teams/" + team_id + "/integrations";
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
            if (null !== bucket_id && 'bucket_id' === column) {
                theValue = bucket_id;
            }
            if (null !== test_id && 'test_id' === column) {
                theValue = test_id;
            }
            out.println("before: " + column + " rawValue: " + theValue + " baseType: " + metaColumn.getBaseType());
            if (theValue && "undefined" !== theValue) {
                theValue = metaColumn.getBaseType().mapValue(theValue);
            }
            out.println("after column:" + column + " mapValue: " + theValue);
            row[column] = theValue;
        }

        //todo add pagesize and offset handler (more rows)
        result.resultData.add(row);
    }

    function processURL(url) {
        log.debug("GET URL " + url);
        out.println("QUERY URL:" + url);
        var rawRowStr = SysUtility.restGet(url, null, auth);
        out.println(rawRowStr);
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

    log.info('DSP:Runscope - query end');
})();
