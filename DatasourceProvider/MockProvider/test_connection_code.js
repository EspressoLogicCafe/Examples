(function () {
    'use strict';

    log.debug("Begin mock testConnection code.");
    var startTime = env.System.nanoTime();

    var returnedObj = {
        status: "OK",
        latency: 10
    };

    if (log.isDebugEnabled()) {
        log.debug("mock - testConnection returning " + returnedObj);
    }

    return returnedObj;
})();
