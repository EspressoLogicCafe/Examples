var AS400 = Java.type("com.ibm.as400.access.AS400");
var DataQueue = Java.type("com.ibm.as400.access.DataQueue");
var AS400Text = Java.type("com.ibm.as400.access.AS400Text");
var DataQueueEntry = Java.type("com.ibm.as400.access.DataQueueEntry");
//Reading the connection info stored in the 'config' resource
var settings = {
        "headers":{"Authorization": "CALiveAPICreator AS400_demo:1"}
    };
var connectionParam = timerUtil.restGet("http://localhost:8080/rest/default/db2i/v1/config", null, settings)
connectionParam = JSON.parse(connectionParam);
var as400System = new AS400(connectionParam.as400Address, connectionParam.as400User, connectionParam.as400Password);
//print(as400System +"/QSYS.LIB/"+connectionParam.as400Library+"/SAMPLEQO.DTAQ");
var dq = new DataQueue(as400System, "/QSYS.LIB/"+connectionParam.as400Library+"/SAMPLEQO.DTAQ");
try{
    DQData = dq.read(0);
    var datedMessage = DQData.getString();
    print("Timer datedMessage::" + datedMessage);        
}catch(e){

}
as400System.disconnectAllServices();

