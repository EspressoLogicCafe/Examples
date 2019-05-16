var readProp = {};  // a common JavaScript technique for name-scoping

readProp.readAPIProperties = function readAPIProperties(filePath) {
    var response = {};
    var prop = java.util.Optional.of(new java.util.Properties()).map(function(p)
            { p.load(new java.io.FileInputStream(filePath)); return p;}).get();
    var propEnum = prop.propertyNames();
    while (propEnum.hasMoreElements()) {
        var propName = propEnum.nextElement();
        var temp = prop.getProperty(propName);
        print("Prop: " + propName + " = " + temp);
        //response.push(tempJ);
        response[propName] = temp;
    }
    print("response::" + response);
    return response;
};
