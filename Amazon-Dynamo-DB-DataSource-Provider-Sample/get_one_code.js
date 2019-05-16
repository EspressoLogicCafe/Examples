log.info("Begin Amazon DynamoDB getByKey:" + entityName );
var DescribeTableResult = Java.type("com.amazonaws.services.dynamodbv2.model.DescribeTableResult");
var KeySchemaElement = Java.type("com.amazonaws.services.dynamodbv2.model.KeySchemaElement");
var AttributeValue = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValue");
var GetItemRequest = Java.type("com.amazonaws.services.dynamodbv2.model.GetItemRequest");
var AttributeValue = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValue");
var Item = Java.type("com.amazonaws.services.dynamodbv2.document.Item");
var ItemUtils = Java.type("com.amazonaws.services.dynamodbv2.document.ItemUtils");

var Integer = Java.type("java.lang.Integer");
var HashMap = Java.type("java.util.HashMap");

var ObjectMapper = Java.type("com.fasterxml.jackson.databind.ObjectMapper");
//Getting the list of Keys from Schema
var keyList = datasourceUtil.getKeyColumnList(entityName);
var key_to_get = new HashMap();
if (keyList.size() > 0) {
    for (var idx2 in keyList) {
        keyName = keyList[idx2];
        keyValue = key[idx2];
        if (!isNaN(keyValue) || typeof keyValue  === 'number') {
            key_to_get.put(keyName,new AttributeValue().withN(Integer.toString(keyValue)));
        }
        else {
            key_to_get.put(keyName,new AttributeValue().withS(keyValue));
        }    
    }
}

var request = new GetItemRequest().withKey(key_to_get).withTableName(entityName);
var returned_item = connection.getItem(request).getItem();
var item = ItemUtils.toItem(returned_item);
var responseObj ={};
if (item!==null) {
    var json = item.toJSONPretty();
    var mapper = new ObjectMapper();
    var actualObj = mapper.readTree(json);
    var row = JSON.parse(actualObj.toString());
    //add Metadata to the response
    if (!skipMetadata) {
        var pkey= "";
        var sep="";
        if (keyList.size() > 0) {
            for (var idx2 in keyList) {
                var pkName = keyList[idx2];
                pkey += sep + encodeURI(row[pkName]);
                sep = "~";
            }
        }
        var linkStr = datasourceUtil.getLinks(parameters.fullEntityName, row);
        row[parameters.metadataName] = {};
        row[parameters.metadataName].links = JSON.parse(linkStr);
        row[parameters.metadataName].href = parameters.baseUrl + datasourceUtil.encodePathSegment(parameters.qualifiedEntityName) + "/" + pkey;
    }
    responseObj = JSON.stringify(row);
}
log.info("End Amazon DynamoDB getByKey:" + entityName + " responseObj::" +responseObj);
return responseObj;
