(function () {
	'use strict';
	log.info('DSP:PetStore - open begin');
	var connection = {};
	out.println('DSP:PetStore - open')
	connection.url = settings.url || "https://petstore.swagger.io/v2";
	if (log.isFinestEnabled()) {
		log.finest('PetStore -  PetStore nothing to do');
	}
	var username = settings.username || "user1";
	var password = settings.password || "password";
	var url = settings.url + "user/login?user=" + username + "&password=" + password;
	out.println("login url " + url);
	var resp = SysUtility.restGet(url, null, null);
	out.println(resp);
	// todo not sure what to do with the login response seesionID
	log.info('DSP:PetStore - open end');
	return connection;
})();
