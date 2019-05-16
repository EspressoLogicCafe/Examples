log.info("Begin Amazon DynamoDB getByquery" + entityName);
var ScanRequest = Java.type("com.amazonaws.services.dynamodbv2.model.ScanRequest");
var ScanResult = Java.type("com.amazonaws.services.dynamodbv2.model.ScanResult");
var Condition = Java.type("com.amazonaws.services.dynamodbv2.model.Condition");
var ComparisonOperator = Java.type("com.amazonaws.services.dynamodbv2.model.ComparisonOperator");
var AttributeValue = Java.type("com.amazonaws.services.dynamodbv2.model.AttributeValue");
var ItemUtils = Java.type("com.amazonaws.services.dynamodbv2.document.ItemUtils");
var Item = Java.type("com.amazonaws.services.dynamodbv2.document.Item");

var ArrayNode = Java.type("com.fasterxml.jackson.databind.node.ArrayNode");
var JsonNodeFactory = Java.type("com.fasterxml.jackson.databind.node.JsonNodeFactory");
var ObjectMapper = Java.type("com.fasterxml.jackson.databind.ObjectMapper");
var JsonNode = Java.type("com.fasterxml.jackson.databind.JsonNode");

var Integer = Java.type("java.lang.Integer");
var HashMap = Java.type("java.util.HashMap");
var List = Java.type("java.util.List");

var scanFilter = new HashMap();
var skipMeta = parameters.isSkipMeta || true;   
parameters.filters.forEach(function (k, v) {
    for (var i = 0; i < v.size(); i++) {
        for (var paramIdx in v[i].parameters) {
            var param = v[i].parameters[paramIdx];
            var attr;
            if (!isNaN(param.value) || typeof param.value  === 'number') {
                attr = new AttributeValue().withN(Integer.toString(param.value));
            }
            else if (typeof param.value  === 'string') {
                attr = new AttributeValue().withS(param.value);
            }
            var paramValue = param.value;
            var condition = new Condition();
            switch (v[i].filterName) {
                case 'equal':
                    condition.withComparisonOperator(ComparisonOperator.EQ).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                case 'notequal':
                    condition.withComparisonOperator(ComparisonOperator.NE).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                case 'greater':
                    condition.withComparisonOperator(ComparisonOperator.GT).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                case 'greaterequal':
                    condition.withComparisonOperator(ComparisonOperator.GE).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                case 'less':
                    condition.withComparisonOperator(ComparisonOperator.LT).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                case 'lessequal':
                    condition.withComparisonOperator(ComparisonOperator.LE).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                case 'like':
                    condition.withComparisonOperator(ComparisonOperator.CONTAINS).withAttributeValueList(attr);
                    scanFilter.put(param.name,condition);
                    break;
                default:
                // Do nothing?
            }
        }
    }
});

var tableResult = connection.describeTable(entityName);
var keyList = tableResult.getTable().getKeySchema();
var scanRequest = new ScanRequest().withTableName(entityName).withLimit(parameters.pagesize).withScanFilter(scanFilter);
var result = connection.scan(scanRequest);
var items =  result.getItems();
var itemList = ItemUtils.toItemList(items);
var array = [];
if (itemList.size()>0) {
    for (var idx2 in itemList) {
        var item =  itemList[idx2];
        var json = item.toJSONPretty();
        var mapper = new ObjectMapper();
        var actualObj = mapper.readTree(json);
        var row = JSON.parse(actualObj.toString());
        if (!skipMetadata) {
            var pkey= "";
            var sep="";
            if (keyList.size() > 0) {
                for (var idx2 in keyList) {
                    var pkName = keyList[idx2].getAttributeName();
                    pkey += sep + encodeURI(row[pkName]);
                    sep = "~";
                }
            }
            var linkStr = datasourceUtil.getLinks(parameters.fullEntityName, row);
            row[parameters.metadataName] = {};
            row[parameters.metadataName].links = JSON.parse(linkStr);
            row[parameters.metadataName].href = parameters.baseUrl + datasourceUtil.encodePathSegment(parameters.qualifiedEntityName) + "/" + pkey;
        }
        array.push(row);
    }   
}

var responseObj = JSON.stringify(array);
log.info("End Amazon DynamoDB getByquery" + entityName + " responseObj::" +responseObj);
return responseObj;
