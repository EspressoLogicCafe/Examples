var AS400 = Java.type("com.ibm.as400.access.AS400");
var KeyedDataQueue = Java.type("com.ibm.as400.access.KeyedDataQueue");
var AS400Text = Java.type("com.ibm.as400.access.AS400Text");
var KeyedDataQueueEntry = Java.type("com.ibm.as400.access.KeyedDataQueueEntry");

var settings = {
        "headers":{"Authorization": "CALiveAPICreator AS400_demo:1"}
    };
var connectionParam = timerUtil.restGet("http://localhost:8080/rest/default/db2i/v1/config", null, settings)
connectionParam = JSON.parse(connectionParam);
var as400System = new AS400(connectionParam.as400Address, connectionParam.as400User, connectionParam.as400Password);
//print(as400System +"/QSYS.LIB/"+connectionParam.as400Library+"/KEYEDQO.DTAQ");
var kdq = new KeyedDataQueue(as400System, "/QSYS.LIB/"+connectionParam.as400Library+"/KEYEDQO.DTAQ");

textKey = new AS400Text(5, as400System);
byteKey = textKey.toBytes("ABC");

try{
    KDQData  = kdq.read(byteKey,0,"EQ");
    var datedMessage = KDQData.getString();
    print("Keyed Timer datedMessage::" + datedMessage);        
}catch(e){
}
as400System.disconnectAllServices();

