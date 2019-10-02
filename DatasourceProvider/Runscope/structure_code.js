(function () {
    'use strict';
    log.info('DSP:Runscope - structure - begin');

    out.println('DSP:Runscope - structure');
    var column;
    var entity;
    var structure = parameters.structure;
    var objectType;
    var collectionType;
    var attributeNames = [];
    var attributeTypes = [];
    var attributeNullable = [];

    entity = {
        name: 'buckets',
        columns: [],
        keys: [],
        parents: []
    };

    column = {
        name: 'auth_token',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'default',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'key',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'name',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'verify_ssl',
        attrTypeName: dspFactory.createBoolean("boolean"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames.push("name");
    attributeNames.push("uuid");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(false);
    attributeNullable.push(false);

    column = {
        name: 'team',
        attrTypeName: dspFactory.createObject("team_obj", attributeNames, attributeTypes, attributeNullable),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    var key = {
        name: "bucket_key",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "key"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);
///////////STEPS //////////////
    entity = {
        name: 'steps',
        columns: [],
        keys: [],
        foreignKeys: []
    };


    column = {
        name: 'id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'bucket_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'test_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'step_type',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'method',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'skipped',
        attrTypeName: dspFactory.createBoolean("boolean"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'url',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'body',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'note',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("source");
    attributeNames.push("comparison");
    attributeNames.push("property");
    attributeNames.push("value");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("assertions_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'assertions',
        attrTypeName: dspFactory.createCollection("assertions_coll", collectionType, objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("name");
    attributeNames.push("property");
    attributeNames.push("source");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    objectType = dspFactory.createObject("variables_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'variables',
        attrTypeName: dspFactory.createCollection("variables_coll", collectionType, objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("username");
    attributeNames.push("auth_type");
    attributeNames.push("password");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    objectType = dspFactory.createObject("step_auth_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'auth',
        attrTypeName: objectType,
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    objectType = dspFactory.createString("string", -1);
    collectionType = 'string';

    column = {
        name: 'scripts',
        attrTypeName: dspFactory.createCollection("scripts_coll", collectionType, objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'before_scripts',
        attrTypeName: dspFactory.createCollection("before_scripts_coll", collectionType, objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    objectType = dspFactory.createString("string", -1);
    collectionType = 'string';
    attributeNames.push("Content-Type");
    attributeNames.push("Accept");
    attributeNames.push("Authorization");
    attributeTypes.push(dspFactory.createCollection("content_coll", collectionType, objectType));
    attributeTypes.push(dspFactory.createCollection("accept_coll", collectionType, objectType));
    attributeTypes.push(dspFactory.createCollection("step_auth_coll", collectionType, objectType));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);

    objectType = dspFactory.createObject("header_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'headers',
        attrTypeName: objectType,
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    key = {
        name: "pk_steps",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "id",
            "bucket_id",
            "test_id"
        ]
    };
    entity.keys.push(key);

    key = {
        name: "ck_step_id",
        seq: 1,
        isDatabasePrimary: false,
        columns: [
            "id"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);

    var foreignKey = {
        name: 'Test_Steps',
        updateRule: 'Restrict',
        deleteRule: 'Restrict',
        parent: {
            name: 'tests'
        }
        , child: {
            name: 'steps'
        }
        , columns: [
            {
                parent: 'id, bucket_id',
                child: 'test_id, bucket_id'
            }
        ]
    };

    structure.foreignKeys.add(foreignKey);

//////////TESTS 
    entity = {
        name: 'tests',
        columns: [],
        keys: [],
        foreignKeys: []
    };


    column = {
        name: 'id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'bucket_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'created_at',
        attrTypeName: dspFactory.createInteger("number", 4),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'name',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'description',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'default_environment_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'trigger_url',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'last_run',
        attrTypeName: dspFactory.createJSON("json_last_run"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("email");
    attributeNames.push("name");
    attributeNames.push("id");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(false);
    attributeNullable.push(false);
    attributeNullable.push(false);

    column = {
        name: 'created_by',
        attrTypeName: dspFactory.createObject("createdBy_obj", attributeNames, attributeTypes, attributeNullable),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    key = {
        name: "pk_test_id",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "id",
            "bucket_id"
        ]
    };
    entity.keys.push(key);
    key = {
        name: "ck_test_id",
        seq: 1,
        isDatabasePrimary: false,
        columns: [
            "id"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);

    foreignKey = {
        name: 'Bucket_Tests',
        updateRule: 'Restrict',
        deleteRule: 'Restrict',
        parent: {
            name: 'buckets'
        }
        , child: {
            name: 'tests'
        }
        , columns: [
            {
                parent: 'key',
                child: 'bucket_id'
            }
        ]
    };
    structure.foreignKeys.add(foreignKey);

///////ACCOUNT
    entity = {
        name: 'account',
        columns: [],
        keys: [],
        parents: []
    };

    column = {
        name: 'name',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'uuid',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'email',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("name");
    attributeNames.push("uuid");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(false);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("team_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';
    column = {
        name: 'teams',
        attrTypeName: dspFactory.createCollection("team_coll", collectionType, objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    key = {
        name: "pk_account",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "id"
        ]
    };
    entity.keys.push(key);
    key = {
        name: "ck_account_uuid",
        seq: 1,
        isDatabasePrimary: false,
        columns: [
            "uuid"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);

///////TEAMS
    entity = {
        name: 'teams',
        columns: [],
        keys: [],
        parents: []
    };

    column = {
        name: 'id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'email',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'name',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'uuid',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    key = {
        name: "pk_team_id",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "id"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);


///////INTEGRATIONS
    entity = {
        name: 'integrations',
        columns: [],
        keys: [],
        parents: []
    };

    column = {
        name: 'team_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);


    column = {
        name: 'description',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'type',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'uuid',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    key = {
        name: "pk_integration_team_id",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "team_id"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);
///// AGENTS
    entity = {
        name: 'agents',
        columns: [],
        keys: [],
        parents: []
    };


    column = {
        name: 'team_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'version',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'agent_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'name',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    key = {
        name: "pk_agent_id",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "team_id"
        ]
    };
    entity.keys.push(key);
    structure.tables.add(entity);
//// SCHEDULES
    entity = {
        name: 'schedules',
        columns: [],
        keys: [],
        parents: []
    };


    column = {
        name: 'id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'bucket_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'test_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);


    column = {
        name: 'note',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'environment_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'interval',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    key = {
        name: "pk_schedules",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "id",
            "bucket_id",
            "test_id"
        ]
    };
    entity.keys.push(key);


    foreignKey = {
        name: 'Test_Schedules',
        updateRule: 'Restrict',
        deleteRule: 'Restrict',
        parent: {
            name: 'tests'
        }
        , child: {
            name: 'schedules'
        }
        , columns: [
            {
                parent: 'bucket_id,id',
                child: 'bucket_id,test_id'
            }
        ]
    };

    structure.foreignKeys.add(foreignKey);
    structure.tables.add(entity);

/////////ENVIRONMENTS
    entity = {
        name: 'environments',
        columns: [],
        keys: [],
        parents: []
    };


    column = {
        name: 'id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'bucket_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);

    column = {
        name: 'test_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'name',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'retry_on_failure',
        attrTypeName: dspFactory.createBoolean("boolean"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'stop_on_failure',
        attrTypeName: dspFactory.createBoolean("boolean"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'verify_ssl',
        attrTypeName: dspFactory.createBoolean("boolean"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'script',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    
      column = {
        name: 'version',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    
      column = {
        name: 'initial_script_hash',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    
    column = {
        name: 'webhooks',
        attrTypeName: dspFactory.createCollection("webhooks_coll", "string","string"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    
     column = {
        name: 'parent_environment_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    
    column = {
        name: 'preserve_cookies',
        attrTypeName: dspFactory.createBoolean("boolean"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'client_certificate',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    
    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("email");
    attributeNames.push("name");
    attributeNames.push("id");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(false);
    attributeNullable.push(false);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("recipient_email_obj", attributeNames, attributeTypes, attributeNullable);
    
    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("notify_on");
    attributeNames.push("notify_all");
    attributeNames.push("recipients");
    attributeNames.push("notify_threshold");
    attributeTypes.push(dspFactory.createBoolean("boolean"));
    attributeTypes.push(dspFactory.createBoolean("boolean"));
    attributeTypes.push(dspFactory.createCollection('recipient_coll', 'object', objectType));
    attributeTypes.push(dspFactory.createInteger("number", 4));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("environment_email_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'emails',
        attrTypeName: objectType,
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    objectType = dspFactory.createString("string", -1);
    collectionType = 'string';
    attributeNames.push("Content-Type");
    attributeNames.push("Accept");
    attributeNames.push("Authorization");
    attributeTypes.push(dspFactory.createCollection("content_coll", collectionType, objectType));
    attributeTypes.push(dspFactory.createCollection("accept_coll", collectionType, objectType));
    attributeTypes.push(dspFactory.createCollection("auth_step_coll", collectionType, objectType));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);

    objectType = dspFactory.createObject("create-header_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'headers',
        attrTypeName: objectType,
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'initial_variables',
        attrTypeName: dspFactory.createJSON("json_variables"),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    
    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("name");
    attributeNames.push("uuid");
    attributeTypes.push(dspFactory.createString("string",-1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);

    objectType = dspFactory.createObject("remote_agent_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';
    
    column = {
        name: 'remote_agents',
        attrTypeName: dspFactory.createCollection("webhook_coll", collectionType ,objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);
    

    key = {
        name: "pk_environment_id",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "id",
            "bucket_id",
            "test_id"
        ]
    };
    entity.keys.push(key);

    key = {
        name: "ck_environment_id",
        seq: 1,
        isDatabasePrimary: false,
        columns: [
            "id"
        ]
    };
    entity.keys.push(key);

    structure.tables.add(entity);

///// REGIONS

    entity = {
        name: 'regions',
        columns: [],
        keys: [],
        parents: []
    };

    attributeNames.push("hostname");
    attributeNames.push("regions_code");
    attributeNames.push("location");
    attributeNames.push("service_provider");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    objectType = dspFactory.createObject("regions_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'regions',
        attrTypeName: dspFactory.createCollection("regions_coll", collectionType, objectType),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    structure.tables.add(entity);

//// results
    entity = {
        name: 'results',
        columns: [],
        keys: [],
        parents: []
    };

    column = {
        name: 'assertions_defined',
        attrTypeName: dspFactory.asInteger(),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'assertions_failed',
        attrTypeName: dspFactory.asInteger(),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'assertions_passed',
        attrTypeName: dspFactory.asInteger(),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'bucket_key',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);


    column = {
        name: 'finished_at',
        attrTypeName: dspFactory.createDecimal("decimal(10,6)", 10, 6),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'agent',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: true,
        isAutoIncrement: false,
        isDefaulted: false
    };
    entity.columns.push(column);

    column = {
        name: 'bucket_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);


    column = {
        name: 'test_id',
        attrTypeName: dspFactory.createString("string", -1),
        isNullable: false,
        isAutoIncrement: false,
        isDefaulted: false,
        extendedProperties: {
            isVirtual: true
        }
    };
    entity.columns.push(column);


    key = {
        name: "pk_create_steps",
        seq: 1,
        isDatabasePrimary: true,
        columns: [
            "bucket_id",
            "test_id"
        ]
    };
    entity.keys.push(key);


    foreignKey = {
        name: 'Test_Results',
        updateRule: 'Restrict',
        deleteRule: 'Restrict',
        parent: {
            name: 'tests'
        }
        , child: {
            name: 'results'
        }
        , columns: [
            {
                parent: 'bucket_id,id',
                child: 'bucket_id,test_id'
            }
        ]
    };

    structure.foreignKeys.add(foreignKey);
    structure.tables.add(entity);
/// PROC create-bucket
    var proc = {
        name: "create-bucket",
        isFunction: false,
        remarks: ":create a new Runscope bucket",
        parameters: [
            {
                name: "name",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "IN",
                isNullable: false
            }, {
                name: "team_uuid",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "IN",
                isNullable: false
            },
            {
                name: "bucket_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "OUT",
                isNullable: false
            }

        ]
    };
    structure.procedures.add(proc);

/// PROC create-test
    proc = {
        name: "create-test",
        isFunction: false,
        remarks: ":create a new Runscope test in a bucket",
        parameters: [
            {
                name: "bucket_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "IN",
                isNullable: false
            }, {
                name: "name",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 2,
                direction: "IN",
                isNullable: false
            }, {
                name: "description",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "IN",
                isNullable: false
            }, {
                name: "id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 3,
                direction: "OUT",
                isNullable: false
            }
        ]
    };
    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("email");
    attributeNames.push("name");
    attributeNames.push("id");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(false);
    attributeNullable.push(false);
    attributeNullable.push(false);

    column = {
        name: 'created_by',
        attrTypeName: dspFactory.createObject("createdBy_obj", attributeNames, attributeTypes, attributeNullable),
        argPosition: 4,
        direction: "OUT",
        isNullable: true
    };
    proc.parameters.push(column);
    structure.procedures.add(proc);


/// PROC create-step

    proc = {
        name: "create-step",
        isFunction: false,
        remarks: ":create a new Runscope step",
        parameters: [
            {
                name: "id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "OUT",
                isNullable: true
            },
            {
                name: "bucket_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "IN",
                isNullable: false
            }, {
                name: "test_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 2,
                direction: "IN",
                isNullable: false
            }, {
                name: "url",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 3,
                direction: "IN_OUT",
                isNullable: false
            }, {
                name: "method",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 4,
                direction: "IN_OUT",
                isNullable: true
            }, {
                name: "note",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 5,
                direction: "IN_OUT",
                isNullable: true
            }, {
                name: "form",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 6,
                direction: "IN_OUT",
                isNullable: true
            }, {
                 name: "step_type",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 7,
                direction: "IN_OUT",
                isNullable: true
            }
        ]
    };


    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    objectType = dspFactory.createString("string", -1);
    collectionType = 'string';
    attributeNames.push("Content-Type");
    attributeNames.push("Accept");
    attributeNames.push("Authorization");
    attributeTypes.push(dspFactory.createCollection("content_coll", collectionType, objectType));
    attributeTypes.push(dspFactory.createCollection("accept_coll", collectionType, objectType));
    attributeTypes.push(dspFactory.createCollection("auth_step_coll", collectionType, objectType));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);

    objectType = dspFactory.createObject("create-header_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'headers',
        attrTypeName: objectType,
        argPosition: 7,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("username");
    attributeNames.push("auth_type");
    attributeNames.push("password");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    objectType = dspFactory.createObject("create_step_auth_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'auth',
        attrTypeName: objectType,
        argPosition: 8,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("source");
    attributeNames.push("property");
    attributeNames.push("name");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    objectType = dspFactory.createObject("variables_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'variables',
        attrTypeName: dspFactory.createCollection("variables_coll", collectionType, objectType),
        argPosition: 9,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("source");
    attributeNames.push("comparison");
    attributeNames.push("property");
    attributeNames.push("value");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("assertion_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'assertions',
        attrTypeName: dspFactory.createCollection("assertion_coll", collectionType, objectType),
        argPosition: 10,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);


    objectType = dspFactory.createString("string", -1);
    collectionType = 'string';

    column = {
        name: 'scripts',
        attrTypeName: dspFactory.createCollection("scripts_coll", collectionType, objectType),
        argPosition: 11,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);

    column = {
        name: 'before_scripts',
        attrTypeName: dspFactory.createCollection("before_scripts_coll", collectionType, objectType),
        argPosition: 12,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);
    
    
    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("name");
    attributeNames.push("value");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("params_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = 'object';

    column = {
        name: 'params',
        attrTypeName: dspFactory.createCollection("params_coll", collectionType, objectType),
        argPosition: 13,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);
    
    column = {
        name: 'skipped',
        attrTypeName: dspFactory.createBoolean("boolean"),
         argPosition: 15,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);
    
     column = {
        name: 'body',
        attrTypeName: dspFactory.createString("string", -1),
         argPosition: 16,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);
    structure.procedures.add(proc);
    
    
    
/// PROC create-substep

    proc = {
        name: "create-substep",
        isFunction: false,
        remarks: ":create a new Runscope substep",
        parameters: [
            {
                name: "id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "OUT",
                isNullable: true
            }, {
                name: "bucket_key",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 2,
                direction: "IN",
                isNullable: false
            }, {
                name: "test_uuid",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 3,
                direction: "IN",
                isNullable: false
            },  {
                 name: "step_type",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 4,
                direction: "IN",
                isNullable: true
            }
        ]
    };

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("source");
    attributeNames.push("property");
    attributeNames.push("name");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    objectType = dspFactory.createObject("variables_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = "object";

    column = {
        name: "variables",
        attrTypeName: dspFactory.createCollection("variables_coll", collectionType, objectType),
        argPosition: 5,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);

    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("source");
    attributeNames.push("comparison");
    attributeNames.push("property");
    attributeNames.push("value");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(true);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("assertion_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = "object";

    column = {
        name: "assertions",
        attrTypeName: dspFactory.createCollection("assertion_coll", collectionType, objectType),
        argPosition: 6,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);    
    
    attributeNames = [];
    attributeTypes = [];
    attributeNullable = [];

    attributeNames.push("name");
    attributeNames.push("value");
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeTypes.push(dspFactory.createString("string", -1));
    attributeNullable.push(true);
    attributeNullable.push(false);
    objectType = dspFactory.createObject("params_obj", attributeNames, attributeTypes, attributeNullable);
    collectionType = "object";

    column = {
        name: "params",
        attrTypeName: dspFactory.createCollection("params_coll", collectionType, objectType),
        argPosition: 7,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);

    column = {
        name: "skipped",
        attrTypeName: dspFactory.createBoolean("boolean"),
         argPosition: 8,
        direction: "IN_OUT",
        isNullable: true
    };
    proc.parameters.push(column);
    
    structure.procedures.add(proc);

////create-schedule
    proc = {
        name: "create-schedule",
        isFunction: false,
        remarks: "create a new Runscope schedule for a test",
        parameters: [
            {
                name: "id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "OUT",
                isNullable: true
            }, {
                name: "bucket_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 2,
                direction: "IN",
                isNullable: false
            }, {
                name: "test_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 3,
                direction: "IN",
                isNullable: false
            },  {
                 name: "environment_id",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 4,
                direction: "IN",
                isNullable: true
            } , {
                 name: "interval",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 5,
                direction: "IN",
                isNullable: true
            }
        ]
    };

    structure.procedures.add(proc);

////trigger-test
    proc = {
        name: "trigger-test",
        isFunction: false,
        remarks: "Trigger the test using the trigger_urlk",
        parameters: [
            {
                name: "trigger_url",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 1,
                direction: "IN",
                isNullable: false
            },{
                name: "environment_uuid",
                attrTypeName: dspFactory.createString("string", -1),
                argPosition: 2,
                direction: "IN_OUT",
                isNullable: true
            } 
        ]
    };

    structure.procedures.add(proc);


    log.info('DSP:Runscope - structure - end');
})();
