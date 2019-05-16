log.info("Begin Amazon DynamoDB  update code");
var UpdateItemRequest = Java.type("com.amazonaws.services.dynamodbv2.model.UpdateItemRequest");
var DescribeTableResult = Java.type("com.amazonaws.services.dynamodbv2.model.DescribeTableResult");
var KeySchemaElement = Java.type("com.amazonaws.services.dynamodbv2.model.KeySchemaElement");
var AttributeValue = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValue");
var AttributeValueUpdate = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValueUpdate");
var AttributeValueUpdate = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValueUpdate");
var AttributeAction = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeAction");
var Item = Java.type("com.amazonaws.services.dynamodbv2.document.Item");
var ItemUtils = Java.type("com.amazonaws.services.dynamodbv2.document.ItemUtils");

var JsonNode = Java.type("com.fasterxml.jackson.databind.JsonNode");

var Integer = Java.type("java.lang.Integer");
var HashMap = Java.type("java.util.HashMap");


var table_name = entityName;
var update_item_values = new HashMap();
log.debug("payload::" + payload);
var valueMap = JSON.parse(payload);
var tempMap = JSON.parse(payload);
var rows = [];
var rowCount = 0;
if (Array.isArray(valueMap) && valueMap.length > 0) {
  rows = valueMap;
}
else {
  rows.push(valueMap);
}

var keyList = datasourceUtil.getKeyColumnList(entityName);
for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    delete row[parameters.metadataName];
    var rq = new UpdateItemRequest();
    if (keyList.size() > 0) {
        for (var idx2 in keyList) {
            keyName = keyList[idx2];
            keyValue = row[keyName];
            if (!isNaN(keyValue) || typeof keyValue  === 'number') {
                rq.addKeyEntry(keyName,new AttributeValue().withN(Integer.toString(keyValue)));
            }else{
                rq.addKeyEntry(keyName,new AttributeValue().withS(keyValue));
            }
            delete row[keyName];
        }
    }
    var item = Item.fromJSON(JSON.stringify(row));
    var item_values = ItemUtils.toAttributeValues(item);
    var update_item_values = new HashMap();
    var keys = item_values.keySet();
    if (keys.size() > 0) {
        keys = keys.toArray();
        for (var idx in keys) {
            var key = keys[idx];
            update_item_values.put(key, new AttributeValueUpdate(item_values.get(key), AttributeAction.PUT));
        }
    }
    rq.setAttributeUpdates(update_item_values);
    rq.setTableName(entityName);
    connection.updateItem(rq);
    rowCount++;
}

var result = {};
result.numOfRows = rowCount;
result.txsummary = tempMap;
log.info("Begin Amazon DynamoDB  update code");
return JSON.stringify(result);
