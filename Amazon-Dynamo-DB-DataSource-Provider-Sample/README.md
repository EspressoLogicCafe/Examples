# Amazon DynamoDB Data Source Provider

Copy the following JARs into your lib/ext folder of LAC instance:
- aws-java-sdk-dynamodb-1.11.393.jar > https://mvnrepository.com/artifact/com.amazonaws/aws-java-sdk-dynamodb/1.11.393
- aws-java-sdk-core-1.11.393.jar > https://mvnrepository.com/artifact/com.amazonaws/aws-java-sdk-core/1.11.393
- jackson-databind-2.6.7.1.jar > https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind/2.6.7.1
- commons-logging-1.1.3.jar > https://mvnrepository.com/artifact/commons-logging/commons-logging/1.1.3
- httpclient-4.5.5.jar > https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient/4.5.5
- httpcore-4.4.9.jar > https://mvnrepository.com/artifact/org.apache.httpcomponents/httpcore/4.4.9
- jackson-annotations-2.6.0.jar > https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-annotations/2.6.0
- jackson-core-2.6.7.jar > https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core/2.6.7
- joda-time-2.8.1.jar > https://mvnrepository.com/artifact/joda-time/joda-time/2.8.1

The following set of *.js files are aimed at providing users with a sample code to create Amazon DynamoDB data source provider. Please note this is just a partial example addressing basic CRUD operation to DynamoDB using LAC 5.0. Customers are expected to use this example, extend and own it.  

This API example works with Live API Creator 5.1 and 5.2 only. 

To use this example, follow the below steps:

1. Stop your LAC API Server.

2. Copy the amazon_dynamo_db folder to your admin repository under system/data_source_providers.

3. Restart your LAC instance.

4. Log in using your System Admin(sa) account.

5. Click **Data Source Provider** > **Initialization** > **configure**. To establish connection to AWS, provide your accessKey and secretKey. Use one of the following options:

```
//var awsCredentials = new BasicAWSCredentials("****","****"); Hard Code the credentials not recomended.
var awsCredentials = new BasicAWSCredentials(accessKey,secretKey); // Read the credentials from a store.
var conn = AmazonDynamoDBClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).build();
```

OR

```
var conn = AmazonDynamoDBClientBuilder.defaultClient(); // Have LAC read it from AWS Config file.
```

5. Click preview, click Test Connection to verify connectivity.

6. Log in using your Admin login and create an API using the Code First approach.

7. In the newly created API, add a new Data Source of type 'Data Source Provider' and select the newly created DynamoDB data source provider.

8. On the Schema page, try to reload the schema. It should show you all the tables in your DynamoDB.

DynamoDB is now ready to be used in LAC. Go to Rest Lab and verify the end points.
