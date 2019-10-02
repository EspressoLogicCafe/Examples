(function () {
    'use strict';
    out.println("Begin Rally sttructure code");
    var structure = parameters.structure;

    out.println("structure url: " + env.RallySchemaURL + "/" + settings.workspaceID);
    out.println("settings: " + settings);
    var rest = new connection.RestCaller();
    var json = rest.get(env.RallySchemaURL + "/" + settings.workspaceID, {
        pagesize: 500
    }, {
        headers: {
            Authorization: connection.credentials
        }
    });


    out.println("getStructure: got " + json);
    var metaEntityTypes = JSON.parse(json);
    out.println("structure:metaEntityTypes.QueryResult : " + JSON.stringify(metaEntityTypes.QueryResult));
    if (metaEntityTypes.QueryResult.Errors.length) {
        throw metaEntityTypes.QueryResult.Errors;
    }
    var results = metaEntityTypes.QueryResult.Results;

// We keep all this metadata around for later reference
    env.metadata = {
        entities: {},
        entityDefs: {},
        entAtts: {}
    };

// Keep track of entities , so that by the time we get more info
// on each one, we can correct or complete its definition.
    var entitiesByUUID = {};

// This is what we return to LAC
    var metadata = {
        entities: []
    };
    var restCallsTypes = [];
    var restCallsAttrs = [];
    for (var i = 0; i < results.length; i++) {
        env.metadata.entities[results[i]._refObjectUUID] = results[i];
        var tableName = results[i]._refObjectName;
        var attributes = results[i].Attributes;
        out.println("Rally Object: " + tableName);
        if (!dspFactory.isTableRelevant(tableName)) {
            //filteredTables.put(tableName, true);
            continue;
        }
        var entity = {
            name: tableName, // Temporary name -- real name gets set below
            type: "TABLE",
            columns: [
                {
                    name: "ObjectID",
                    attrTypeName: generateType('INTEGER', -1, -1, -1),
                    isNullable: false,
                    isReadOnly: true
                },
                {
                    name: "ObjectUUID",
                    attrTypeName: generateType('ObjectUUID', -1, -1, -1),
                    isNullable: false,
                    isReadOnly: true
                },
                {
                    name: "VersionId",
                    attrTypeName: generateType('INTEGER', 10, -1, -1),
                    isNullable: false,
                    isReadOnly: true
                },
                {
                    name: "CreationDate",
                    attrTypeName: generateType('DATE', -1, -1, -1),
                    isNullable: false,
                    isReadOnly: true
                }
            ],
            keys: [
                {
                    name: "PRIMARY",
                    isDatabasePrimary: true,
                    columns: ["ObjectID"]
                }
            ],
            parents: []
        };
        entitiesByUUID[results[i]._refObjectUUID] = entity;
        restCallsTypes.push({ref: results[i]._ref, uuid: results[i]._refObjectUUID});
        metadata.entities[tableName] = entity;

        structure.tables.add(entity);
    }

    // define the palette of 'metaEntityTypes' this model will use
    function generateType(type, size, precision, scale) {
        var attrTypeName;
        switch (type) {
            default:
                return dspFactory.createString("STRING", -1);
            case "BINARY":
                return dspFactory.createBinary("BINARY", 32700);
            case "BOOLEAN":
                return dspFactory.createBoolean("BOOLEAN");
            case "DATETIME":
            case "DATE":
                return dspFactory.createTimestampWithZone("DATE", 3);
            case "DECIMAL":
                return dspFactory.createDecimal("DECIMAL(" + precision + "," + scale + ")", precision, scale);
            case "INTEGER":
                return dspFactory.createLong("INTEGER");
            case "QUANTITY":
                return dspFactory.createDecimal("QUANTITY", 10, 2);
            case "RATING":
                return dspFactory.createString("RATING", -1);
            case "STATE":
                return dspFactory.createString("STATE", 100);
            case "ObjectUUID":
                return dspFactory.createString("ObjectUUID", 36);
            case "STRING":
                attrTypeName = size === -1 ? "STRING" : "STRING(" + size + ")";
                return dspFactory.createString(attrTypeName, size);
            case "TEXT":
                attrTypeName = size > 0 ? "TEXT(" + size + ")" : "TEXT";
                return dspFactory.createString(attrTypeName, size);
            case "WEB_LINK":
                return dspFactory.createString("WEB_LINK", 200);
            case "OBJECT":
                return dspFactory.createString("OBJECT", 32700);
            case "COLLECTION":
                return dspFactory.createString("COLLECTION", 32700);
            case "RAW":
                return dspFactory.createJSON("RAW");
            case "MAP":
                return dspFactory.createString("MAP", 32700);
            case "BINARY_DATA":
                return dspFactory.createString("BINARY_DATA", -1);
        }

    }

    function createObjectType(parentType) {
        var attrTypeName = null;
        var attributeNames = [];
        var attributeTypeNames = [];
        var attributeNullable = [];

        for (var idx in parentType.columns) {
            var column = parentType.columns[idx];
            attributeNames.push(column.name);
            attributeTypeNames.push(column.attrTypeName);
            attributeNullable.push(column.isNullable);
        }

        attrTypeName = dspFactory.createObject(parentType.name + "_obj", attributeNames, attributeTypeNames, attributeNullable);
        return attrTypeName;
    }

    // var attrsRes = connection.HTTPThreadProcessor.processHTTPInParallel(attrsRequestList);

    function buildAttributes(entityName, attributeDefinitions) {
        for (var i = 0; i < attributeDefinitions.length; i++) {
            var currentEntity = metadata.entities[entityName];
            var attDef = attributeDefinitions[i];

            if (!currentEntity) {
                continue;
            }
            if (attDef.AttributeType === "OBJECT") {
                print("OBJECT attribute: " + attDef.ElementName + " json: " + JSON.stringify(attDef));
                var refObjectName = attDef.AllowedValueType._refObjectName;
                var parentType = metadata.entities[refObjectName];
                if (parentType) {
                    var attrTypeName = generateType("RAW", attDef.MaxLength, 10, 2);
                    currentEntity.columns.push({
                        name: attDef.ElementName,
                        attrTypeName: attrTypeName,
                        isNullable: true,
                        extendedProperties:
                            {
                                "name": attDef.Name,
                                "isSortable": attDef.Sortable,
                                "isReadOnly": attDef.ReadOnly,
                                "isSystemRequired": attDef.SystemRequired,
                                "isFilterable": attDef.Filterable,
                                "isHidden": attDef.Hidden
                            }
                    });
                    var foreignKey = {
                        name: currentEntity.name + "_" + attDef.ElementName + "_to_" + parentType.name,
                        parent: {name: parentType.name},
                        child: {name: currentEntity.name},
                        updateRule: "NO ACTION",
                        deleteRule: "NO ACTION",
                        columns: []
                    };
                    foreignKey.columns.push({
                        parent: "ObjectID",
                        child: attDef.ElementName
                    });
                    out.println("   Parent RELN attr:" +
                        attDef.ElementName + " json: " + JSON.stringify(foreignKey)
                    )
                    ;
                    structure.foreignKeys.add(foreignKey);
                } else {
                    print("   Error>> OBJECT parent not created entity name:" + attDef.ElementName + "_" + currentEntity.name + ".. but not its parent: " + attDef.AllowedValueType._refObjectUUID);
                }
            } else if (attDef.AttributeType === "COLLECTION") {
                //need to find the child entity (collection type) and add a child reln
                // var entityRefUUID = attDef.AllowedValueType && attDef.AllowedValueType._refObjectUUID;
                var refObjectName = attDef.AllowedValueType && attDef.AllowedValueType._refObjectName;
                var childEntity = metadata.entities[refObjectName];
                out.println("COLLECTION refObjectName " + refObjectName + " json:" + JSON.stringify(attDef));
                if (childEntity) {
                    var foreignKey = {
                        name: currentEntity.name + "_" + refObjectName + "_has_" + attDef.ElementName,
                        parent: {name: currentEntity.name},
                        child: {name: refObjectName},
                        updateRule: "NO ACTION",
                        deleteRule: "NO ACTION",
                        columns: []
                    };
                    foreignKey.columns.push({
                        parent: "ObjectID",
                        child: "ObjectID"
                    });
                    out.println("   CHILD RELN " + JSON.stringify(foreignKey));
                    structure.foreignKeys.add(foreignKey);
                } else {
                    out.println("   ERROR: Child Reln not created for " + attDef.ElementName);
                }
            } else {

                if (attDef) {
                    if ('ObjectID' !== attDef.ElementName
                        && 'ObjectUUID' !== attDef.ElementName
                        && 'VersionId' !== attDef.ElementName
                        && 'CreationDate' !== attDef.ElementName) {
                        var precision = 10;
                        var scale = attDef.MaxFractionalDigits || 0;
                        var attrTypeName;
                        //This is a bug in the schema - this attribute type is INTEGER - but the value (schemaType) is string
                        if ("FormattedID" === attDef.ElementName || "formattedID" === attDef.ElementName) {
                            attrTypeName = generateType("STRING", attDef.MaxLength, precision, scale);
                        } else {
                            attrTypeName = generateType(attDef.AttributeType, attDef.MaxLength, precision, scale);
                        }
                        out.println("  Attribute name: " + attDef.ElementName + " type:" + attDef.AttributeType + " attDef json: " + JSON.stringify(attDef));
                        currentEntity.columns.push({
                            name: attDef.ElementName,
                            attrTypeName: attrTypeName,
                            isNullable: !attDef.Required,
                            isReadOnly: attDef.ReadOnly,
                            extendedProperties:
                                {
                                    "name": attDef.Name,
                                    "isSortable": attDef.Sortable,
                                    "isSystemRequired": attDef.SystemRequired,
                                    "isFilterable": attDef.Filterable,
                                    "isHidden": attDef.Hidden,
                                    "isNullable": !attDef.Required,
                                    "isReadOnly": attDef.ReadOnly,
                                }
                        });
                    }
                }
            }
        }
    }

    //build up the list of attributes for each entity
    for (var i = 0; i < results.length; i++) {
        var tableName = results[i]._refObjectName;
        var attributes = results[i].Attributes;
        out.println("Attributes for: " + tableName);
        buildAttributes(tableName, attributes);
    }

})();
