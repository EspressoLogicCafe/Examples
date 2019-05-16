log.info("Begin Amazon DynamoDB  Delete code");
var DescribeTableResult = Java.type("com.amazonaws.services.dynamodbv2.model.DescribeTableResult");
var KeySchemaElement = Java.type("com.amazonaws.services.dynamodbv2.model.KeySchemaElement");
var AttributeValue = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValue");

var Integer = Java.type("java.lang.Integer");
var HashMap = Java.type("java.util.HashMap");

var key_to_get = new HashMap();
var keyList = datasourceUtil.getKeyColumnList(entityName);
if (keyList.size() > 0) {
    for (var idx2 in keyList) {
        keyName = keyList[idx2];
        keyValue = parameters.entityKey[idx2];
        if (!isNaN(keyValue) || typeof keyValue  === 'number') {
            key_to_get.put(keyName, new AttributeValue().withN(Integer.toString(keyValue)));
        }
        else {
            key_to_get.put(keyName, new AttributeValue().withS(keyValue));
        }    
    }
}

connection.deleteItem(entityName, key_to_get);
log.info("End Amazon DynamoDB  Delete code");
return "{}";
