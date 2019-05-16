log.info("Begin Amazon DynamoDB  insert code");
var JsonNode = Java.type("com.fasterxml.jackson.databind.JsonNode");
var Item = Java.type("com.amazonaws.services.dynamodbv2.document.Item");
var ItemUtils = Java.type("com.amazonaws.services.dynamodbv2.document.ItemUtils");

var table_name = entityName;
var valueMap = JSON.parse(payload);
var rows = [];
var rowCount = 0;
if (Array.isArray(valueMap) && valueMap.length > 0) {
  rows = valueMap;
}
else {
  rows.push(valueMap);
}
for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    delete row[parameters.metadataName];
    var item = Item.fromJSON(JSON.stringify(row));
    var item_values = ItemUtils.toAttributeValues(item);
    log.debug("item_values:" + item_values);
    connection.putItem(table_name, item_values);
    rowCount++;
}

var result = {};
result.numOfRows = rowCount;
result.txsummary = valueMap;
log.info("End Amazon DynamoDB  insert code" +JSON.stringify(result));
return JSON.stringify(result);
