var AS400 = Java.type("com.ibm.as400.access.AS400");
var KeyedDataQueue = Java.type("com.ibm.as400.access.KeyedDataQueue");
var AS400Text = Java.type("com.ibm.as400.access.AS400Text");

//Reading the connection info stored in the 'config' resource
var connectionParam = SysUtility.getResource('config');
var as400System = new AS400(connectionParam.as400Address, connectionParam.as400User, connectionParam.as400Password);

var message = parameters.message
var key = parameters.key
if(message.length >20){
    return {error:"message cannot be more than 20"}
}

if(key.length >5){
    return {error:"key cannot be more than 5"}
}

var textData = new AS400Text(20, as400System);
var byteData = textData.toBytes(message);
textKey = new AS400Text(5, as400System);
byteKey = textKey.toBytes(key);

var kdq = new KeyedDataQueue(as400System, "/QSYS.LIB/"+connectionParam.as400Library+"/KEYEDQO.DTAQ");
print(key + " --- " + message);
kdq.write(byteKey,byteData);
as400System.disconnectAllServices();
return { response: 'Success'};
