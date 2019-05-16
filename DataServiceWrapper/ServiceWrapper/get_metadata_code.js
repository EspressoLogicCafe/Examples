print("\nBegin RESTMashUp getStructure, settings: " + settings.toString());
var RestCaller = Java.type("com.kahuna.logic.lib.rest.RestCaller");
var serviceAddress = settings && settings.serviceAddress || "http://localhost:8181/rest/default/demo";
var restCaller = new RestCaller();
var response = restCaller.get(serviceAddress + "/v1/@docs", null, connection);
response = JSON.parse(response);

var result = {};
result.entities = [];
var table_names =response.tags;
for (var idx in table_names) {
    var tempTableName = table_names[idx].name;
    if(!tempTableName.startsWith("Table ")){
        continue;
    }
    entity = {};
    
    tempTableName = tempTableName.substring(6);
    tempTableName = unescape(tempTableName);
    entity.name = tempTableName;
    entity.columns = [];
    print("entity.name::" + entity.name);
    var attributeList = response.definitions[tempTableName].properties;
    var keys = Object.keys(attributeList);
        for (var idx1 in keys) {
            column = {};
            column.name = keys[idx1];
            column.generic_type= attributeList[keys[idx1]].type;  
            entity.columns.push(column);
        }
    entity.keys = [];
    key = {};
    key.columns = [];
    var keyList = response.definitions[tempTableName].required;
    for (var idx2 in keyList) {
        key.name = keyList[idx2];
        key.type = "PRIMARY";
        key.columns.push(keyList[idx2])
    }
    entity.keys.push(key);
    result.entities.push(entity);
}
print(JSON.stringify(result));
print("End RESTMashUp getStructure\n");
return JSON.stringify(result);
