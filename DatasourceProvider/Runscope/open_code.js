(function () {
    'use strict';
    log.info('DSP:Runscope - open begin');
    var connection = {};
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
    log.info('DSP:Runscope - open end');
    connection.auth = auth;
    connection.baseURL = baseURL;
    return connection;
})();
