log.info("Begin RESTMashup testConnection code.");
var result = {};
var serverHitTimeOutInMillis = 10000;
var startTime = env.System.nanoTime();

// Connecting..
try {
    var endTime = env.System.nanoTime();
	var minLatency = 1000000000;
	minLatency = endTime - startTime;
}
catch (e) {
	print("Error thrown during testConnection:" + e.message);
	e.printStackTrace();
	return {
		status: "NOT OK",
		message: e.message
	};
}

// Latency
var latencyInMillis = minLatency / 1000000;
var returnedObj = {
	status: "OK",
	latency: latencyInMillis
};

return returnedObj;
