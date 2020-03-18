
var schema = "type Query{hello: String}";
out.println("DSP:test conneciton settings " + settings);
var graphqlURL = settings && settings.graphqlURL || "http://localhost:8080/graphql/sandbox/cust";
var username = settings && settings.username || 'admin';
var password = settings && settings.password || 'Password1';

var payload = {"query": 
"{ __schema \n{ queryType \n{fields \n{name \ntype \n{ kind\n ofType \n{ kind\n name \n} \n} \n} \n} \n} \n}"
};
var startTime = Date.now();
out.println("Begin GraphQL testConnection code to "+ graphqlURL);
try {
    var parms = {};
    var restPostSettings = { "headers": {"Authorization" : "CALiveAPICreator demo_full:1"}};
    var json = SysUtility.restPost(graphqlURL, parms, restPostSettings, payload);
   // out.println(json);
} catch (e) {
    e.printStackTrace();
    print("End Rally testConnection code -- error: " + e.toString);
    return {
        status: "Error",
        message: e.toString()
    };
}

var resultObj = {
	status: 'OK',
	latency: 10
};

if (log.isDebugEnabled()) {
	log.debug('GraphQL - testConnection result: ' + resultObj);
}

log.info('GraphQL - testConnection end');
return resultObj;
