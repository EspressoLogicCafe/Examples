 (function () {
    'use strict';

    log.info("DSP:GraphQL - structure begin");
    out.println("GraphQL Structure begin");
  
    var structure = parameters.structure;
    dspFactory.createString("string", -1);
    
    var payload = {"query": "{ __schema { queryType {fields {name type { kind ofType { kind name } } } } } }"};
    var graphqlURL = env.GraphSQLEndpoint;
    var settings = env.headers;
    out.println("Begin GraphQL structure code to "+ graphqlURL);
    var fields = [];
    var schema = SysUtility.restPost(graphqlURL, {}, settings, payload);
    out.println(schema);
    var query = JSON.parse(schema);
  
    fields = query.data["__schema"].queryType.fields;
 
 // Process all entities first
   
  for (var i in fields) {
    
        out.println(fields[i].name);
        
        var entity = {
            name: fields[i].name,
            columns: [],
            keys: [],
            parents: []
        };
        structure.tables.add(entity);
 
    } 

    function createAttrType(type, typeName, size, length, precision, scale) {
            var attrTypeName;
            switch (type) {
               default:
                case "String":
                    return dspFactory.createString("String", -1);
                case "Float":
                case "BigDecimal":
                    return dspFactory.createDecimal("BigDecimal", 10,2);      
                case "Int":
                    return dspFactory.createInteger("Int", 4);
                case "Boolean":
                    attrTypeName = 'Boolean';
                    return dspFactory.createBoolean(attrTypeName);
            }
    }
    
    function getAttributes(entity) {
        var gql = {"query":"query { __type(name:\"" + entity.name + "\") { kind    name fields { name  type { kind ofType { name kind } name } }  } }"};
        out.println(JSON.stringify(gql, null, 2));
        var attrs = SysUtility.restPost(graphqlURL, {}, settings, gql);
        out.println(attrs);
        var attrFields = JSON.parse(attrs);
        var data = attrFields.data;
        var dbTypeName;
        var column = {};
        if( null !== data && null !== data["__type"]) {
            var fieldList = data["__type"].fields || [];
            for (var i in fieldList) {
                var field = fieldList[i];
                out.println("field "+ JSON.stringify(field, null, 2));
                 column = {};
                 if("SCALAR" === field.type.kind) {
                     out.println(field.name + " " + field.type.name);
                     dbTypeName = createAttrType(field.type.name);
                    column = {
                        name: field.name,
                        attrTypeName: dbTypeName,
                        isNullable: false,
                        isAutoIncrement: false,
                        isDefaulted: false
                    };
                    entity.columns.push(column);
                 }  else if(null !== field.type.ofType && "SCALAR" === field.type.ofType.kind) {
                     out.println(field.name + " " + field.type.ofType.name);
                     dbTypeName = createAttrType(field.type.ofType.name);
                    column = {
                        name: field.name,
                        attrTypeName: dbTypeName,
                        isNullable: false,
                        isAutoIncrement: false,
                        isDefaulted: false
                    };
                    entity.columns.push(column);
                 } 
                 else if (null !== field.type.ofType && ("LIST" === field.type.ofType.kind || "OBJECT" === field.type.ofType.kind)) {
                    out.println(field.type.ofType.kind + ": " + field.name);
                    var relEntity = structure.tables[field.name];
                 }
            }
        }
    }

    // next process fields for each entity (and relns)
    var tables = structure.tables;
    for(var idx in tables) {
        entity = tables[idx];
        getAttributes(entity);
    }
     if (log.isDebugEnabled()) {
        log.debug("DSP:GraphQL - structure result: " + JSON.stringify(structure));
    }
    log.info("DSP:GraphQL - structure end");
})();
