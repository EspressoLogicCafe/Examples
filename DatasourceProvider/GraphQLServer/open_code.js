
out.println("DSP:open settings "+ settings);
var graphqlURL = settings && settings.graphqlURL|| "http://localhost:8080/graphql/sandbox/cust";
var username = settings && settings.username || 'admin';
var password = settings && settings.password || 'Password1';
out.println("Begin GraphQL open code to "+ graphqlURL);
// we could to @authentication here and get the apikey
//post @authentication {username and password} 
var apikey = "demo_full";
var parms = {};
var headers = { "headers": {"Authorization" : "CALiveAPICreator "+apikey+":1"}};

   
env.GraphSQLEndpoint = graphqlURL;
env.headers = headers;
out.println("open env.GraphSQLEndpoint: "+env.GraphSQLEndpoint);
return null;
