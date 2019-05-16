// Listener code goes here or check out examples ( see top right dropdown menu ) 
print("Start Listerner");
var System = java.lang.System;
var currentDir = System.getProperty("user.dir");
var propFileName = "/default.properties"; // replace it with your own property file.
//print("currentDir::" + currentDir);//location of the properties file.
//print("propFileName::" + propFileName);//Name of the propery file.
//var jsonObject = readProp.readAPIProperties(currentDir+propFileName)
var props = readProp.readAPIProperties("/Users/khaab05/Downloads/default.properties");
globalVariable.setMap(props);
//print(JSON.stringify(jsonObject));
//print("loadResource = " + jsonObject.loadResource);
//print("resourceURL = " + jsonObject.resourceURL);
print("End Listerner");
