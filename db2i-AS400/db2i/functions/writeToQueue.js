var AS400 = Java.type("com.ibm.as400.access.AS400");
var DataQueue = Java.type("com.ibm.as400.access.DataQueue");
var AS400Text = Java.type("com.ibm.as400.access.AS400Text");

var connectionParam = SysUtility.getResource('config');
var as400System = new AS400(connectionParam.as400Address, connectionParam.as400User, connectionParam.as400Password);
var textData = new AS400Text(200, as400System);
var message = parameters.message
if(message.length >200){
    return {error:"message cannot be more than 200"}
}
message += ' - ' + new Date();
var dq = new DataQueue(as400System, "/QSYS.LIB/"+connectionParam.as400Library+"/SAMPLEQO.DTAQ");
dq.write(textData.toBytes(message) );
as400System.disconnectAllServices();
return { response: 'Success'};
