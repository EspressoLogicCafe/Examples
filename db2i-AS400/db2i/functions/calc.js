if(parameters.num1 === 0  || parameters.num2===0){
        return {result: "Invalid Input"} ;
}
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
    programName = "/QSYS.LIB/"+connectionParam.as400Library+"/RPG003.PGM";

    as400ZonedDecimal = new AS400ZonedDecimal(15, 0);
    num1 = java.lang.Double.valueOf(parameters.num1);
    num2 = java.lang.Double.valueOf(parameters.num2);
    //Input
	parameterList1 = new ProgramParameter(as400ZonedDecimal.toBytes(num1));
	parameterList2 = new ProgramParameter(as400ZonedDecimal.toBytes(num2));
	//Output
	parameterList3 = new ProgramParameter(100);
	parameterList4 = new ProgramParameter(100);
	parameterList5 = new ProgramParameter(100);
	parameterList6 = new ProgramParameter(100);
	
	parameterList = Java.to([parameterList1, parameterList2, parameterList3,parameterList4,parameterList5,parameterList6],"com.ibm.as400.access.ProgramParameter[]");
	program.setProgram(programName, parameterList);
	if (program.run() != true) {
	    print("Program failed!");
	}else{
	    textData = new AS400Text(20, as400System);
		addRS = textData.toObject(parameterList[2].getOutputData());
		subRS = textData.toObject(parameterList[3].getOutputData());
		mulRS = textData.toObject(parameterList[4].getOutputData());
		divRS = textData.toObject(parameterList[5].getOutputData());
		response = {Add:java.lang.Double.valueOf(addRS),Sub:java.lang.Double.valueOf(subRS),Mul:java.lang.Double.valueOf(mulRS),Div:java.lang.Double.valueOf(divRS)};
	}
}catch(e){
    print("Program " + program.getProgram() + " issued an exception!");
    e.printStackTrace();
}

return response;
