out.println("MySQL invoke function code");
//"call stored proc by name bind IN args"
//procedure_name
var sql = "call " + env.leftQuote + procedure_name + env.rightQuote;
sql += "(";
var argString = "?";
var pa;
for (var i = 0; i < procArgs.size(); i++) {
	sql += argString;
	argString = ", ?";
}

sql += " )";
out.println("Callable Statement SQL " + sql);
out.println("Payload: " + payload);
var inputJson = JSON.parse(payload);

var procArgList = procEntity.getArgs();
for (var pos in procArgList) {
	var procArg = procArgList[pos];
	var idx = procArg.getArgPosition();
	out.println(idx + ") Proc argName " + procArg.getName());
	out.println(idx + ") Proc direction " + procArg.getDirection());
	out.println(idx + ") Proc JDBC Type " + procArg.getJdbcSqlType());
}

var cstmt = connection.prepareCall(sql);

var argPosition = 1;
var pa;
for (var i = 0; i < procArgs.size(); i++) {
	pa = procArgs[i];
	if (pa.getDirection() == "OUT" || pa.getDirection() == "IN_OUT") {
		cstmt.registerOutParameter(pa.getArgPosition(), pa.getJdbcSqlType());
		argPosition++;
	}

	if (pa.getDirection() == "IN" || pa.getDirection() == "IN_OUT") {
		var objValue = inputJson[pa.getName()]; //Where do we get this
		out.println("bind IN " + pa.getName() + " to value " + objValue);
		cstmt.setObject(pa.getArgPosition(), objValue);
		argPosition++;
	}
}

//process results here
out.println("Begin Execute invoke");
var row = {};
var data = [];

var hasRs = cstmt.execute();

while (hasRs) {
	out.println("has results");
	var rs = cstmt.getResultSet();
	var rowIdx = 0;
	while (rs.next()) {
		row = [];
		out.println("found row");
		for (var idx = 3; i < 6; idx++) {
			row.push(rs.getString(3));
			// out.println(row);
		}

		var dataRow = {};
		//out.println(row);
		dataRow[rowIdx] = row;
		rowIdx++;
		data.push(dataRow);
	}

	rs.close();
	hasRs = cstmt.getMoreResults();
}

for (var i = 0; i < procArgs.size(); i++) {
	pa = procArgs[i];
	row = [];
	if (pa.getDirection() == "OUT" || pa.getDirection() == "IN_OUT") {
		var value = cstmt.getObject(pa.getArgPosition());
		var procArgName = {};
		procArgName[pa.getName()] = value;
		row.push(procArgName);
	}
	data.push({outparms: row});
}

cstmt.close();

out.println("invoke done");
return JSON.stringify(data);
