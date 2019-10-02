(function () {
    'use strict';

    log.info('DSP:JDBCExample - query begin');

    function quoteIdentifier(env, s) {
        'use strict';
        return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
    }

    var result = parameters.result;
    var metaEntity = parameters.metaEntity;
    var inlineStrategy = parameters.inlineStrategy;

    var JavaSqlTypes = Java.type('java.sql.Types');

    var entityName = metaEntity.entity;
    var entityNameWithPrefix = metaEntity.entityName;

    var pagesize = parameters.pagesize;
    var offset = parameters.offset;

    var filterSql = '';
    var joinPrefix = '';
    var order = '';

    var parmValues = [];

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
            case 'notequal':
                filterType = ' != ' + argHolder;
                filterTypeNull = ' is not null';
                break;
            case 'less':
                filterType = ' < ' + argHolder;
                filterTypeNull = null;
                break;
            case 'lessequal':
                filterType = ' <= ' + argHolder;
                filterTypeNull = null;
                break;
            case 'greater':
                filterType = ' > ' + argHolder;
                filterTypeNull = null;
                break;
            case 'greaterequal':
                filterType = ' >= ' + argHolder;
                filterTypeNull = null;
                break;
            case 'like':
                filterType = ' like ' + argHolder;
                filterTypeNull = null;
                break;
            case 'notlike':
                filterType = ' not like ' + argHolder;
                filterTypeNull = null;
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
            }
        }

        filterSql += joinPrefix + '(' + subfilter + ')';
        joinPrefix = '\n   and '
    }

    if ('' === filterSql) {
        filterSql = '1 = 1';
    }

    var join = '';
    var orders = parameters.orders;

    for (var i = 0; i < orders.size(); i++) {
        var param = orders[i];
        if (log.isFinestEnabled()) {
            log.finest('   Order by : ' + quoteIdentifier(env, param.column.name) + ' ' + param.sortAction);
        }
        var orderSnippet;
        switch (param.sortAction) {
            case 'asc':
                orderSnippet = quoteIdentifier(env, param.column.name) + ' asc';
                break;
            case 'asc_uc':
                orderSnippet = 'upper(' + quoteIdentifier(env, param.column.name) + ') asc';
                break;
            case 'asc_lc':
                orderSnippet = 'lower(' + quoteIdentifier(env, param.column.name) + ') asc';
                break;
            case 'desc':
                orderSnippet = quoteIdentifier(env, param.column.name) + ' desc\n';
                break;
            case 'desc_uc':
                orderSnippet = 'upper(' + quoteIdentifier(env, param.column.name) + ') desc';
                break;
            case 'desc_lc':
                orderSnippet = 'lower(' + quoteIdentifier(env, param.column.name) + ') desc';
                break;
            case 'null_first':
                orderSnippet = 'case when ' + quoteIdentifier(env, param.column.name) + ' is null then 0 else 1 end';
                break;
            case 'null_last':
                orderSnippet = 'case when ' + quoteIdentifier(env, param.column.name) + ' is null then 1 else 0 end';
                break;
            default:
                throw 'DSP:JDBCExample cannot handle sort action of ' + param.sortAction;
        }
        order += join + orderSnippet + '\n';
        join = '      ,';
    }

    if ('' === order) {
        order = '1 asc';
    }

    var sep = '';
    var selectColumnList = '';
    var entityMetaColumns = metaEntity.getColumns();
    for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
        var metaColumn = entityMetaColumns[idx];
        if (!metaColumn.persistent) {
            continue;
        }
        var column = metaColumn.name;
        // need to fix column name to database specs - different for each database
        // a'b -> a''b
        // a"b -> a""b
        // "a"b" -> a\"b
        var quotedColumn = quoteIdentifier(env, column);
        selectColumnList += sep + quotedColumn;
        sep = '\n      ,';
    }

    var quotedEntityName = quoteIdentifier(env, entityName);

    var sql = ''
        + 'select ' + selectColumnList + '\n'
        + '  from ' + quotedEntityName + '\n'
        + ' where ' + filterSql + '\n'
        + ' order by ' + order
    ;

     //This is specific for MySQL
    if (offset <= 0) {
    	sql = sql + " limit " + (pagesize + 1);
    }
    else {
    	sql = sql + " limit " + (pagesize + 1) + "," + offset;
    }

    out.println('SQL Query: ' + sql);
    if (log.isDebugEnabled()) {
        log.debug('SQL Query: ' + sql);
    }

    var pstmt = connection.prepareStatement(sql);

    for (var idx = 0; idx < parmValues.length; ++idx) {
        var jdbcIdx = 1 + idx;
        var parmValue = parmValues[idx];
        var baseType = parmValue.metaColumn.baseType;
        var generic_type = baseType.getGenericType();
        value =  parmValue.value;
        switch(generic_type) {
            default:

            break;
            case 'time':
                var IntervalDayHourMinuteSecond = Java.type("com.kahuna.util.IntervalDayHourMinuteSecond");
                value = IntervalDayHourMinuteSecond.valueOf(IntervalDayHourMinuteSecond.Subtype.HOURS_MINUTES_SECONDS, parmValue.value);
                break;
            case 'date':
                break;
        }
        if (log.isDebugEnabled()) {
            var logMessage = 'JDBCExample - colName = ' + parmValue.metaColumn.name + ', value = ' + value;
            log.debug(logMessage);
        }

        baseType.setSqlParameterValue(pstmt, jdbcIdx, parmValue.value);
    }

    var rs = pstmt.executeQuery();
    var numObjects = 0;

    var meta = rs.getMetaData();

    result.moreData = false;
    result.nextOffset = parameters.offset;

    while (rs.next()) {
        ++numObjects;
        if (numObjects > pagesize) {
            result.moreData = true;
            break;
        }

        ++result.nextOffset;

        var row = dspFactory.createRow();
        for (var idx = 0; idx < entityMetaColumns.length; ++idx) {
            var jdbcIdx = idx + 1;
            var metaColumn = entityMetaColumns[idx];
            var name = metaColumn.name;
            var sqlType = meta.getColumnType(jdbcIdx);
            var baseType = metaColumn.getBaseType();
			var genericType = metaColumn.getGenericType();
            out.println("sqlType:" + sqlType + " , baseType: "+ baseType +" ,genericType:" + metaColumn.getGenericType());
            var value;
            switch (sqlType) {
                case JavaSqlTypes.BLOB:
                    var blob = rs.getBlob(jdbcIdx);
                    if (null == blob || rs.wasNull()) {
                        value = null;
                    } else {
                        var lobLength = blob.length;
                        if (null == inlineStrategy
                            || lobLength <= inlineStrategy.checksumLimit
                            || lobLength <= inlineStrategy.getInlineLimit(name)) {
                            if (0 === lobLength) {
                                value = [];
                            } else {
                                value = blob.getBytes(1, lobLength);
                            }
                        } else {
                            value = dspFactory.makeBinaryProxyObject(name, lobLength);
                        }
                    }
                    break;
                case JavaSqlTypes.CLOB:
                    var clob = rs.getClob(jdbcIdx);
                    if (null == blob || rs.wasNull()) {
                        value = null;
                    } else {
                        var lobLength = clob.length;
                        if (null == inlineStrategy
                            || lobLength <= inlineStrategy.checksumLimit
                            || lobLength <= inlineStrategy.getInlineLimit(name)) {
                            if (0 == lobLength) {
                                value = "";
                            } else {
                                value = clob.getSubString(1, lobLength);
                            }
                        } else {
                            value = dspFactory.makeStringProxyObject(name, lobLength);
                        }
                    }
                    break;
                case JavaSqlTypes.TIME:
                    var valueStr = rs.getString(jdbcIdx);
                    var IntervalDayHourMinuteSecond = Java.type("com.kahuna.util.IntervalDayHourMinuteSecond");
                    if(valueStr && null !=- valueStr) {
                    value = IntervalDayHourMinuteSecond.valueOf(IntervalDayHourMinuteSecond.Subtype.HOURS_MINUTES_SECONDS, valueStr);
                    } 
                    else {
                        value = null;
                    }
                    break;
                case JavaSqlTypes.DATE:
                    var bytes = rs.getBytes(jdbcIdx);
                    if(null === bytes) {
                        value = null;
                    } 
                    else {
                        var String = Java.type("java.lang.String");
                        var SimpleDate = Java.type("com.kahuna.util.SimpleDate");
                        var  StandardCharsets = Java.type("java.nio.charset.StandardCharsets");
                        var valueStr = new String(bytes, StandardCharsets.UTF_8);
                		value = SimpleDate.valueOf(valueStr);
                    }
                    break;
                case JavaSqlTypes.TIMESTAMP:
                    var bytes = rs.getBytes(jdbcIdx);
                    if(null === bytes) {
                        value = null;
                    } 
                    else {
                        var String = Java.type("java.lang.String");
                        var SimpleTimestamp = Java.type("com.kahuna.util.SimpleTimestamp");
                        var SimpleTimestampOffset = Java.type("com.kahuna.util.SimpleTimestampOffset");
                        var  StandardCharsets = Java.type("java.nio.charset.StandardCharsets");
                        var valueStr = new String(bytes, StandardCharsets.UTF_8);
                		
                		switch (genericType) {
                		    default:
			                case "timestamp":
                				value = SimpleTimestamp.valueOf(valueStr);
                				break;
			                case "timestamp with time zone":
				                value = SimpleTimestampOffset.valueOf(valueStr);
				                break;
                        } 
                    }
                    break;
                case JavaSqlTypes.BIT:
                    value = rs.getObject(jdbcIdx);
                    if('boolean' === genericType) {
                        break;
                    }
                    var precision = baseType.getSize();
                    if(1 !== precision) {
                        var BitMask = Java.type("com.kahuna.util.BitMask");
            			var bm = new BitMask(precision);
            			bm.setBits(value, true);
            			value = bm;
                    } 
                    else {
                        value = rs.getInt(jdbcIdx);
                    }
        			break;
                default:
                    value = rs.getObject(jdbcIdx);
                    break;
            }

            row[name] = value;
        }

        result.resultData.add(row);
    }

    rs.close();
    pstmt.close();

    if (log.isDebugEnabled()) {
        var logMessage = 'DSP:JDBCExample - query - Result ' + result;
        log.debug(logMessage);
    }

    log.info('DSP:JDBCExample - query end');
})();