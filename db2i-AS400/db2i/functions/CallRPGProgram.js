var AS400 = Java.type("com.ibm.as400.access.AS400");
var ProgramCall = Java.type("com.ibm.as400.access.ProgramCall");
var ProgramParameter = Java.type("com.ibm.as400.access.ProgramParameter");
var AS400Text = Java.type("com.ibm.as400.access.AS400Text");
var AS400ZonedDecimal  = Java.type("com.ibm.as400.access.AS400ZonedDecimal");

//Reading the connection info stored in the 'config' resource
var connectionParam = SysUtility.getResource('config');
var as400System = new AS400(connectionParam.as400Address, connectionParam.as400User, connectionParam.as400Password);
var program = new ProgramCall(as400System);
var response;

try{
    programName = "/QSYS.LIB/"+connectionParam.as400Library+"/RPG002.PGM";
    //Input        
    textData = new AS400Text(20, as400System);
    parameterList0 = new ProgramParameter(textData.toBytes(parameters.firstName));

    textData = new AS400Text(20, as400System);
    parameterList1 = new ProgramParameter(textData.toBytes(parameters.lastName));

    as400ZonedDecimal = new AS400ZonedDecimal(3, 0);
    myAge = java.lang.Double.valueOf(parameters.age);
	parameterList2 = new ProgramParameter(as400ZonedDecimal.toBytes(myAge));
	
	//Output
	parameterList3 = new ProgramParameter(100);
	
	parameterList = Java.to([parameterList0, parameterList1, parameterList2,parameterList3],"com.ibm.as400.access.ProgramParameter[]");
	program.setProgram(programName, parameterList);
	
	if (program.run() != true) {
	    print("Program failed!");
	}else{
	    textData = new AS400Text(100, as400System);
		response = textData.toObject(parameterList[3].getOutputData());
	}
}catch(e){
    print("Program " + program.getProgram() + " issued an exception!");
    e.printStackTrace();
}

return { result: response};
