log.info("Begin Amazon DynamoDB getStructure");
var ListTablesRequest = Java.type("com.amazonaws.services.dynamodbv2.model.ListTablesRequest");
var AmazonDynamoDB = Java.type("com.amazonaws.services.dynamodbv2.AmazonDynamoDB");
var ListTablesResult = Java.type("com.amazonaws.services.dynamodbv2.model.ListTablesResult");
var DescribeTableResult = Java.type("com.amazonaws.services.dynamodbv2.model.DescribeTableResult");
var AttributeDefinition = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeDefinition");
var KeySchemaElement = Java.type("com.amazonaws.services.dynamodbv2.model.KeySchemaElement");

var result = {};
result.entities = [];

var more_tables = true;
var last_name = null;
var request;
var entity, column, key;
//Setting a limit to the number of tables returned.
if (last_name === null) {
    request = new ListTablesRequest().withLimit(100);
}
else {
    request = new ListTablesRequest().withLimit(100).withExclusiveStartTableName(last_name);
}

/*
Connecting to the DB and fetching the list of tables. 
Note the connection object internally calls the configure code to get the connection.
*/
var table_list = connection.listTables(request);
var table_names = table_list.getTableNames();
if (table_names.size() > 0) {
    for (var idx in table_names) {
        entity = {};
        var tableResult = connection.describeTable(table_names[idx]);
        entity.name =  tableResult.getTable().getTableName();
        entity.columns = [];
        var attributeList = tableResult.getTable().getAttributeDefinitions();
        if (attributeList.size() > 0) {
            for (var idx1 in attributeList) {
                column = {};
                column.name = attributeList[idx1].getAttributeName();
                if (attributeList[idx1].getAttributeType() === 'N') {
                    column.generic_type= "number";    
                }
                else if (attributeList[idx1].getAttributeType() === 'S') {
                    column.generic_type= "S"; 
                    column.subtype = "String";
                }        
                entity.columns.push(column);
            }
        }

        entity.keys = [];
        key = {};
        key.columns = [];
        var keyList = tableResult.getTable().getKeySchema();
        if (keyList.size() > 0) {
            for (var idx2 in keyList) {
                key.name = keyList[idx2].getAttributeName();
                key.type = "PRIMARY";
                key.columns.push(keyList[idx2].getAttributeName())
            }
        }
        entity.keys.push(key);
        result.entities.push(entity);
    }
}

log.info("End Amazon DynamoDB getStructure::" + JSON.stringify(result));
return JSON.stringify(result);
