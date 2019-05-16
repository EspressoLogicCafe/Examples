/*
 * In-scope variables are,
 * 1. connection - The Connection Object. (JavaScript Object). This is the connection
 *                  returned by start connection code for this provider.
 * 2. topic ( String )
 * 3. message - Payload Message . JavaScript Object
 * 4. Options . (JavaScript Object)
 options = {
    headers : {}, // Camel headers
    parameters : {} // Camel URL parameters that could be dynamically added.
}
 */
var context = connection.camelContext;
var producer = context.createProducerTemplate();
var body = SysUtility.getBytes(message);
var ftpURI = connection.connectionURI;

// Resolve options
if (typeof options != 'undefined' && null !== options) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            if (key === 'headers') {
                var headerMap = options[key];
            }else if (key === 'parameters'){
                var parameterMap = options[key];
                
                if(typeof parameterMap !== 'undefined' && null !== parameterMap 
                && ftpURI.length){
                    for(var p in parameterMap){
                        if(parameterMap.hasOwnProperty(p)){
                            ftpURI = ftpURI + '&'+p+"="+parameterMap[p]; 
                        }
                    }
                }
            }
            else {
                log.debug("Unrecognized option : "+key);
            }
      }
    }
}

producer.start();
// Publish message based on the options.
try {
    if (headerMap && !headerMap.isEmpty()) {
        producer.sendBodyAndHeaders(ftpURI,message,headerMap);
    }
    else {
        producer.sendBody(ftpURI,message);
    }
}
catch(e) {
    log.error("Exception thrown : "+e);
    throw e;
}
finally {
    producer.stop();
}
