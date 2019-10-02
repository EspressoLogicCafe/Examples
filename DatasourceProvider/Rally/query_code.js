(function () {
    'use strict';
    print("Begin Rally query code");
    var result = parameters.result;
    var metaEntity = parameters.metaEntity;
    var entityName = metaEntity.entity;
    var pagesize = ++parameters.pagesize;
    var offset = 0 === parameters.offset ? 1 : ++parameters.offset;

    var rest = new connection.RestCaller();
    out.println('pagesize: ' + pagesize);
    out.println('start: ' + offset);

    function quoteIdentifier(env, s) {
        'use strict';
        return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
    }

    function isColumnUsedInRole(columnName) {
        var roleToParents = metaEntity.getRolesFromChildToParents();
        out.println("Function isColumnUsedInRole  " + columnName);
        for (var roleIdx in roleToParents) {
            out.println(">>>>roleidx" + roleIdx);
            var metaRole = roleToParents[roleIdx];
            out.println(">>>>" + metaRole.name);
            var metaColumns = metaRole.getColumns();
            for (var y in metaColumns) {
                var col = metaColumns[y];
                out.println("   >>>>test role colname " + col.name + " ===" + columnName);
                if (col.name === columnName) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function isAttributeUsedInParentRole(metaEntity,attrName) {
		var roles = metaEntity.getRolesFromChildToParents();
		for (var idx in roles) {
		    var metaRole = roles[idx];
			var metaColumns = metaRole.getColumns();
			for (var jidx in metaColumns) {
			    var metaColumn = metaColumns[jidx];
				if (metaColumn.name.equals(attrName)) {
					return true;
				}
			}
		}
		return false;
    }
	
    var ArrayList = Java.type('java.util.ArrayList');
    var entityMetaColumns = metaEntity.getColumns();
    var numObjects = 0;
    out.println('execute REST Get: ' + connection.RallyBaseURL + "/" + entityName);
    var start = (offset === 0) ? 1 : offset;
    var filter = "?workspace=" + connection.RallyBaseURL + "/Workspace/" + connection.workspaceID;

    var filterSql = '';
    var joinPrefix = '';
    var order = '';

    var parmValues = [];
    var sysFilters = parameters.filters.sysfilters || [];
    for (var idx = 0; idx < sysFilters.length; ++idx) {
        var thisFilter = sysFilters[idx];
        var filterName = thisFilter.name;
        out.println("filterName: " + filterName);
        if (log.isFinestEnabled()) {
            log.finest('FilterName is: ' + filterName);
        }

        var argHolder = '';
        var nameTransform;


        var filterType;
        var filterTypeNull;
        switch (filterName) {
            case 'equal':
                filterType = "=";
                filterTypeNull = null;
                break;
            case 'notequal':
                filterType = '!=' + argHolder;
                filterTypeNull = null;
                break;
            case 'less':
                filterType = '<' + argHolder;
                filterTypeNull = null;
                break;
            case 'lessequal':
                filterType = '<=' + argHolder;
                filterTypeNull = null;
                break;
            case 'greater':
                filterType = '>' + argHolder;
                filterTypeNull = null;
                break;
            case 'greaterequal':
                filterType = '>=' + argHolder;
                filterTypeNull = null;
                break;
            case 'like':
                filterType = 'contains';
                filterTypeNull = null;
                break;
            case 'notlike':
                filterType = '!contains';
                filterTypeNull = null;
                break;
            default:
                throw 'Unhandled sysfilter type ' + filterName;
        }
        out.println("filterType: " + filterType);
        var subfilter = '';

        for (var paramIdx in thisFilter.columnValueList) {
            var param = thisFilter.columnValueList[paramIdx];
            var innerJoinPrefix = 0 === paramIdx ? '' : thisFilter.useAndSemantics ? ' and ' : ' or ';


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
                // subfilter += innerJoinPrefix + nameTransform(metaColumn.name) ;
            } else {
                // subfilter += innerJoinPrefix + nameTransform(metaColumn.name);
                parmValues.push({
                    metaColumn: metaColumn,
                    value: value
                });
            }
            var type = metaColumn.getGenericType();
            switch (type) {
                default:
                    break;
                case "date":
                case "text":
                case "string":
                    // value = '"' + value + '"';
                    break;
            }
            var usedInParentRole = isAttributeUsedInParentRole(metaEntity, metaColumn.name);
            out.println("isAttributeUsedInParentRole:" + usedInParentRole + 'for ' + metaColumn.name);
            var fullColumnName = usedInParentRole ? metaColumn.name + ".ObjectID" : metaColumn.name;
            filterSql += innerJoinPrefix + "(" + fullColumnName + "%20" + filterType + "%20" + value + ")";
        }

        joinPrefix = ' and '
    }

    if ('' !== filterSql) {
        filter += "&query=" + filterSql;
    }

    out.println("filter: " + filter);

    var join = '';
    var orders = parameters.orders;

    for (var i = 0; i < orders.size(); i++) {
        var param = orders[i];
        if (log.isFinestEnabled()) {
            log.finest('   order = : ' + param.column.name + ' ' + param.sortAction);
        }
        var orderSnippet;
        switch (param.sortAction) {
            case 'asc':
                orderSnippet = param.column.name + '%20asc';
                break;
            case 'desc':
                orderSnippet = param.column.name + '%20desc';
                break;
            default:
                throw 'DSP:Rally cannot handle sort action of ' + param.sortAction;
        }
        order += join + orderSnippet;
        join = '  , ';
    }

    if ('' !== order) {
        filter += "&" + encodeURI('order=' + order + '');
    }

    out.println("filter " + filter);


    //Each result row returns a reference link
    function processRowReference(ref, type) {
        json = rest.get(ref, {}, {
            headers: {
                Authorization: connection.credentials
            }
        });
        out.println("ref found: " + json);

        var res = JSON.parse(json);
       var idx = type.lastIndexOf("/");
        if (idx > 0) {
            type = type.substring(idx + 1);
        }
        
        var linkType = null === type? entityName : type;
        var thisRow = res[type];

        var row = dspFactory.createRow();
        for (var idx in entityMetaColumns) {
            var metaColumn = entityMetaColumns[idx];

            var column = metaColumn.name;
            var theValue = thisRow[column];
            out.println("   Testing column: " + column + ": " + theValue);
            if (!metaColumn.persistent) {
                continue;
            }
            if (theValue) {
                if ("object" === (typeof theValue)) {
                    //theValue = metaColumn.getBaseType().mapValue(JSON.stringify(theValue));
                    // row[column] = theValue;
                    var link = theValue["_ref"];
                    var type = theValue["_type"];
                    var idx = link.lastIndexOf("/");
                    if (idx > 5) {
                        link = link.substring(idx + 1);
                    }
                    out.println("column: " + column + " baseType: " + metaColumn.getBaseType() + " link: " + link);
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

    //Find the QueryResult using the filter
    out.println("Query URL: " + connection.RallyBaseURL + "/" + entityName + filter);
    var json = rest.get(connection.RallyBaseURL + "/" + entityName + filter, {
        pagesize: pagesize,
        start: offset
    }, {
        headers: {
            Authorization: connection.credentials
        }
    });
    out.println("Query returned: " + json);

    var res = JSON.parse(json);

    //process each row using a _ref link
    //optimization - do all the _ref links im parallel
    result.moreData = false;
    result.nextOffset = parameters.offset;
    var rowCount = 0;
    if (res.hasOwnProperty("QueryResult")) {
        if (res.QueryResult.Errors && res.QueryResult.Errors.length > 0) {
            throw res.QueryResult.Errors[0];
        }
        var totalResultCount = res.QueryResult.TotalResultCount;
        var queryResults = res.QueryResult.Results;
        if (Array.isArray(queryResults)) {
            for (var idx in queryResults) {
                var thisRow = queryResults[idx];
                ++rowCount;
                if (rowCount > pagesize) {
                    result.moreData = true;
                    return;
                }

                processRowReference(thisRow._ref, thisRow._type);
                ++result.nextOffset;
            }
        } else {
            processRowReference(queryResults._ref, thisRow._type);
        }
    }
    print("Rally query: end ");
})();
