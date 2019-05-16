var connectionName = "db2iDataQueueK";
var topic ="";
var message = parameters.message;

var messageObject = {
    dateObject : new Date(),
    id : 1,
    comment : message
};
// Convert messageObject to JSON.
var messageAsJSON = JSON.stringify(messageObject);
//log.debug(messageAsJSON);

var options = {key: 'ABC'};
try {
    return SysUtility.publishMessage(connectionName, null, messageAsJSON, options);
}
catch (e){
    return "Exception here: " + e.rootCause;
}

return true;
