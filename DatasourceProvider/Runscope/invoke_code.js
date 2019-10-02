log.info("Begin Runscope invoke");
var logMessage = "";

// Invoke a function
var runscopeURL = connection.baseURL || "https://api.runscope.com/";
var auth = connection.auth;
out.println(runscopeURL);
out.println("Runscope invoke " + procedure_name);
var procArgs = procEntity.getArgs();

if (log.isFinestEnabled()) {
    logMessage = "Runscope - Procedure " + procedure_name;
    log.finest(logMessage);
}
out.println(payload);
var url;
var jsonPayload = JSON.parse(payload);
switch (procedure_name) {
    default:
        throw "Procedure not found";
    case "create-bucket":
        url = runscopeURL + "buckets";
        break;
    case "create-test":
        var bucket_id = jsonPayload["bucket_id"];
        url = runscopeURL + "buckets/" + bucket_id + "/tests";
        break;
    case "create-substep":
        var bucket_id = jsonPayload["bucket_key"];
        var test_id = jsonPayload["test_id"];
        url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/steps";
        break;
    case "create-step":
        var bucket_id = jsonPayload["bucket_id"];
        var test_id = jsonPayload["test_id"];
        url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/steps";
        break;
    case "create-schedule":
        var bucket_id = jsonPayload["bucket_id"];
        var test_id = jsonPayload["test_id"];
        url = runscopeURL + "buckets/" + bucket_id + "/tests/" + test_id + "/schedules";
        break;
    case "trigger-test":
        var trigger_url = jsonPayload["trigger_url"];
        var environmnet_uuid = jsonPayload["environment_uuid"];
        url =  trigger_url;
        if (environmnet_uuid) {
            url += "?runscope_environment=:"+environmnet_uuid;
        }
        break;
}
out.println(url);
var result = SysUtility.restPost(url, null, auth, payload);
out.println("Result: " + result);
var json = JSON.parse(result);

if (log.isDebugEnabled()) {
    logMessage = "Runscope - invoke with result " + result;
    log.debug(logMessage);
}

log.info("End Runscope invoke");
return result;
