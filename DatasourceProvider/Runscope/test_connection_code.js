'use strict';

log.info('DSP:Runscope - testConnection begin');
var resultObj = {
    status: 'OK',
    latency: 0
};

var baseURL = settings.baseURL;
var access_token = settings.access_token;
out.println(baseURL);
var auth = {
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + access_token
    }
};
out.println(access_token);
var url = baseURL + "/account";
var result = SysUtility.restGet(url, {}, auth);
out.println(result);
out.println(result);
var json = JSON.parse(result);
if (json.meta.status !== 'success') {
    resultObj.status = "NOT OK";
    log.error("Unable to connect to runscope account using " + baseURL + " and access token " + access_token);
}
log.info('DSP:Runscope - testConnection end');
return resultObj;
