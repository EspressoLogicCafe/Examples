(function () {
	'use strict';
	log.info('DSP:PetStore - config info - begin');

	var configInfo = {};

	configInfo.ui_config = [
		{
			display: 'url',
			type: 'string',
			length: 90,
			required: true,
			parameterName: 'url',
			placeholder: 'Enter the petstore URL',
			description: 'The OpenAPI Server e.g. https://petstore.swagger.io/v2'
		},
		{
			display: 'username',
			type: 'string',
			length: 20,
			required: true,
			parameterName: 'username',
			placeholder: 'Enter the petstore username',
			description: 'The default is user1'
		},
		{
			display: 'password',
			type: 'string',
			length: 30,
			required: true,
			parameterName: 'password',
			placeholder: 'Enter the petstore password',
			description: 'The default is password'
		}
	];

	// Environment variables used in all JS code (e.g., env.jdbcInfo)
	configInfo.env = {
		System: Java.type("java.lang.System")
	};

	if (log.isDebugEnabled()) {
		log.debug('DSP:PetStore - config info return' + JSON.stringify(configInfo));
	}

	out.println('DSP:PetStore - config info - ' + JSON.stringify(configInfo));

	log.info('DSP:PetStore config info code');

	return configInfo;
})();
