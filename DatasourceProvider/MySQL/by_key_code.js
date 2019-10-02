(function () {
	'use strict';

	log.info('DSP:JDBCExample - getByKey begin');

	function quoteIdentifier(env, s) {
		'use strict';
		return env.leftQuote + s.replace(/"/, '\\"') + env.rightQuote;
	}

	var result = parameters.result;

	var metaEntity = parameters.metaEntity;
	var persistentKey = parameters.persistentKey;
	var inlineStrategy = parameters.inlineStrategy;
    var pagesize = parameters.pagesize;
    var offset = parameters.offset;
    
	var JavaSqlTypes = Java.type('java.sql.Types');

	var entityName = metaEntity.entity;

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

	var joinPrefix = '';

	var parmValues = [];
	var pkMetaColumns = persistentKey.metaKey.columns;

	var filterSql = '';
	for (var idx in pkMetaColumns) {
		var metaColumn = pkMetaColumns[idx];
		var column = metaColumn.name;

		var quotedColumn = quoteIdentifier(env, column);
		filterSql += joinPrefix + quotedColumn + ' = ?';
		joinPrefix = '\n   and ';
		parmValues.push({
			metaColumn: metaColumn,
			value: persistentKey.getValueFor(column)
		});
	}

	var sql = ''
		+ 'select ' + selectColumnList + '\n'
		+ '  from ' + quotedEntityName;
	
	if ('' !== filterSql) {
		sql += '\n where ' + filterSql;
	}
    
    //This is specific for MySQL
    if (offset <= 0) {
    	sql = sql + " limit " + (pagesize + 1);
    }
    else {
    	sql = sql + " limit " + (pagesize + 1) + "," + offset;
    }
	

	if (log.isDebugEnabled()) {
		var logMessage = 'SQL Query: ' + sql;
		log.debug(logMessage);
	}

	var pstmt = connection.prepareStatement(sql);

	for (var idx = 0; idx < parmValues.length; ++idx) {
		var jdbcIdx = 1 + idx;
		var parmValue = parmValues[idx];
		var baseType = parmValue.metaColumn.baseType;
		var value = parmValue.value;

		if (log.isDebugEnabled()) {
			var logMessage = 'JDBCExample - PKey colName = ' + parmValue.metaColumn.name + ', value = ' + parmValue.value;
			log.debug(logMessage);
		}

		baseType.setSqlParameterValue(pstmt, jdbcIdx, value);
	}

	var rs = pstmt.executeQuery();
	var numObjects = 0;

	var meta = rs.getMetaData();

	result.moreData = false;
	result.nextOffset = parameters.offset;

	while (rs.next()) {
		++numObjects;
		if (numObjects > 1) {
			// only expect a single record to be found
			throw 'More than one record found';
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
            out.println("sqlType:" + sqlType + " , metaColumn: "+ baseType +" ,genericType:" + metaColumn.getGenericType());
			var value = null;
			switch (sqlType) {
			case JavaSqlTypes.BLOB:
				var blob = rs.getBlob(jdbcIdx);
				if (null == blob || rs.wasNull()) {
					value = null;
				}
				else {
					var lobLength = blob.length;
					if (null == inlineStrategy
						|| lobLength <= inlineStrategy.checksumLimit
						|| lobLength <= inlineStrategy.getInlineLimit(name)) {
						if (0 === lobLength) {
							value = [];
						}
						else {
							value = blob.getBytes(1, lobLength);
						}
					}
					else {
						value = dspFactory.createBinaryProxyObject(name, lobLength);
					}
				}
				break;
			case JavaSqlTypes.CLOB:
				var clob = rs.getClob(jdbcIdx);
				if (null == blob || rs.wasNull()) {
					value = null;
				}
				else {
					var lobLength = clob.length;
					if (null == inlineStrategy
						|| lobLength <= inlineStrategy.checksumLimit
						|| lobLength <= inlineStrategy.getInlineLimit(name)) {
						if (0 == lobLength) {
							value = "";
						}
						else {
							value = clob.getSubString(1, lobLength);
						}
					}
					else {
						value = dspFactory.createStringProxyObject(name, lobLength);
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
                 out.println("TIMESTAMP BY KEY");
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
                        out.println(">>>"+  genericType + " value: "+ value);
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
		var logMessage = 'DSP:JDBCExample - byKey - Result ' + result;
		log.debug(logMessage);
	}

	log.info('DSP:JDBCExample - byKey end');
})();
