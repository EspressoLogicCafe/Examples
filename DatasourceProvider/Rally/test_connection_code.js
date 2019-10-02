(function () {
    'use strict';

    var rest = new env.RestCaller();
    var startTime = Date.now();
    out.println("Begin Rally testConnection code");
    try {
        var json = rest.get(env.RallyBaseURL + "/TypeDefinition", {
            pagesize: 1
        }, {
            headers: {
                Authorization: "Bearer " + settings.authtoken
            }
        });
    } catch (e) {
        e.printStackTrace();
        print("End Rally testConnection code -- error: " + e.toString);
        return {
            status: "Error",
            message: e.toString()
        };
    }

    out.println("End Rally testConnection code " + json);
    return {
        status: "OK",
        latency: Date.now() - startTime
    };
})();
