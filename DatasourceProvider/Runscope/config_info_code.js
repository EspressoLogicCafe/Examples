(function () {
    'use strict';
    log.info('DSP:Runscope - config info - begin');

    var configInfo = {};

    configInfo.ui_config = [
        {
            display: 'Base URK',
            type: 'string',
            length: 90,
            required: true,
            parameterName: 'baseURL',
            placeholder: 'Enter the Runscope URL - https://api.runscope.com',
            description: 'The base runscope URL e.g. https://api.runscope.com'
        },
        {
            display: 'Access Token',
            type: 'string',
            length: 90,
            required: true,
            parameterName: 'access_token',
            placeholder: 'Enter the Runscope access token',
            description: 'The Client access_token of the application.'
        }
    ];

    // Environment variables used in all JS code (e.g., env.jdbcInfo)
    configInfo.env = {
        System: Java.type("java.lang.System"),
        leftQuote: '',
        rightQuote: ''
    };

    if (log.isDebugEnabled()) {
        log.debug('DSP:Runscope - config info return' + JSON.stringify(configInfo));
    }

    out.println('DSP:Runscope - config info - ' + JSON.stringify(configInfo));

    log.info('DSP:PetStore config info code');

    return configInfo;
})();
