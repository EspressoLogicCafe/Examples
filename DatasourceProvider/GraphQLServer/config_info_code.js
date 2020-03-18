log.info("Begin GraphQL configInfoCode()");
out.println("config info");
var configInfo = {
	ui_config: [{
		display: "GraphQL URL",
		type: "string",
		length: 200,
		required: true,
		parameterName: "graphqlURL",
		placeholder: "Enter the GraphQL Server: http://localhost:8080/graphql/sandbox/cust",
		description: "GraphQL connection strings have the format:<p>" +
			"<code>http://host1[:port1]/grqphql</code><p/>" +
			"See the <a href='http://graphql.org' target='_blank'>GraphQL documentation</a> " +
			"for details."
	}, {
		display: "Username",
		type: "string",
		length: 200,
		required: false,
		parameterName: "username",
		placeholder: "Enter the authentication username, if there is one (optional)",
		description: "Authorized username for your graphql endpoint, if you are using authentication"
	}, {
		display: "Password",
		type: "secret",
		length: 200,
		required: false,
		parameterName: "password",
		placeholder: "The secret password for your graphql user (optional)",
		description: "Password for your authorized graphql user."
	}
	],
	// Environment
	env: {
	    GraphQLServer: "http://localhost:4000/",
		System: Java.type("java.lang.System"),
	    RestCaller: Java.type("com.kahuna.logic.lib.rest.RestCaller"),
		ExecutionResult: Java.type("graphql.ExecutionResult"),
        GraphQL: Java.type("graphql.GraphQL"),
        Builder: Java.type("graphql.GraphQL.Builder"),
        GraphQLSchema: Java.type("graphql.schema.GraphQLSchema"),
        StaticDataFetcher: Java.type("graphql.schema.StaticDataFetcher"),
        RuntimeWiring:  Java.type("graphql.schema.idl.RuntimeWiring"),
        SchemaGenerator: Java.type("graphql.schema.idl.SchemaGenerator"),
        SchemaParser: Java.type("graphql.schema.idl.SchemaParser"),
        TypeDefinitionRegistry: Java.type("graphql.schema.idl.TypeDefinitionRegistry")
	},
	// Capabilities
	options: {
		canCommit: false
	}
};
log.info("End GraphQL configInfoCode()");

return configInfo;
