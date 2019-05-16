print("\nBegin RESTMashUp getByquery - entityName: " + entityName  + ", parameters: " + parameters);
/*
to test in REST Lab:
http://localhost:8080/rest/default/demoInt/v1/CustomerOrders_DeclarativeViaService?sysfilter=equal(name: 'Alpha and Sons')
*/
print("parameters: " + parameters);  // TODO - result: filters: undefined
var thisEntity = parameters.qualifiedEntityName;  
print ("\nthisEntity: " + thisEntity);  // e.g, CustomerOrders_DeclarativeViaService.OrdersViaService
var queryParam = [];
parameters.filters.forEach(function (k, v) {
	for (var i = 0; i < v.size(); i++) {
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			var paramValue = param.value;
			if(paramValue instanceof java.lang.String && paramValue.contains("'")){
			   queryParam.push("sysfilter="+v[i].filterName+"("+param.name+":\""+paramValue+"\")");
			}else{
			   queryParam.push("sysfilter="+v[i].filterName+"("+param.name+":'"+paramValue+"')"); 
			}
		}
	}
});

parameters.orders.forEach(function (k, v) {
	for (var i = 0; i < v.size(); i++) {
		for (var paramIdx in v[i].parameters) {
			var param = v[i].parameters[paramIdx];
			queryParam.push("sysorder=("+param.name+":" +param.action+")");
		} 
	}
});

if(parameters.pagesize){
    queryParam.push("pagesize="+parameters.pagesize);
}

if(parameters.offset){
    queryParam.push("offset="+parameters.offset);
}

print("queryParam::" + queryParam);
print("***************************************")
var RestCaller = Java.type("com.kahuna.logic.lib.rest.RestCaller");
var restCaller = new RestCaller(); 
var serviceAddress = connection && connection.serviceAddress || "http://localhost:8080/rest/default/demo";
var debugFilterValue = "";
if(queryParam.length>0){
    debugFilterValue = "?"+queryParam[0];
    for(var i=1;i<queryParam.length;i++){
        debugFilterValue = debugFilterValue +"&"+ queryParam[i];
    }
}


print("debugFilterValue::" + debugFilterValue);
var debugURL = serviceAddress + "/v1/" + entityName + debugFilterValue;
debugURL = encodeURI(debugURL);
print("\ndebugURL: " + debugURL);
var response = restCaller.get(debugURL, null, connection.auth);
var columnList;
print("End RESTMashUp getByquery on entity: " + entityName + ", responseObj\n" +response);
var responseJ = JSON.parse(response);
var columnList = [];
var aliasColumnList = [];
if (parameters.columnList) {
	for (var column in parameters.columnList) {
		alias = null != parameters.columnList[column] ? parameters.columnList[column] : column;
		columnList.push(column);
		aliasColumnList.push(alias);
	}
}
columnList.push("@metadata");
var finalResponse = [];
print("columnList:" + columnList + " length:" + columnList.length);
print("aliasColumnList:" + aliasColumnList);
for(var i=0;i<responseJ.length;i++){
    var temp = responseJ[i];
    print(i + " - " + JSON.stringify(temp));
    var tempResponse = {};
    for(var j=0;j<columnList.length;j++){
        var temp2 = columnList[j];
        print(j + " column " + temp2);
        if(temp2 && temp2 != undefined){
            tempResponse[temp2] = temp[temp2];    
        }
        
    }
    print("tempResponse:" + JSON.stringify(tempResponse));
    finalResponse.push(tempResponse);
    print("finalResponse:" + JSON.stringify(finalResponse));
}






return JSON.stringify(finalResponse);
