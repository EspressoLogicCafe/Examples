log.info("Begin Amazon DynamoDB configure_code");
var BasicAWSCredentials = Java.type("com.amazonaws.auth.BasicAWSCredentials");
var AmazonDynamoDBClientBuilder = Java.type("com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder");
var AWSStaticCredentialsProvider = Java.type("com.amazonaws.auth.AWSStaticCredentialsProvider");
var Regions = Java.type("com.amazonaws.regions.Regions");

var accessKey = settings.accessKey;
var secretKey = settings.secretKey;
var conn;
//var conn = AmazonDynamoDBClientBuilder.defaultClient()
//var awsCredentials = new BasicAWSCredentials(accessKey,secretKey);
var awsCredentials = new BasicAWSCredentials("****","*****");
var conn = AmazonDynamoDBClientBuilder.standard().withRegion(Regions.US_EAST_1).withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).build();

log.info("End Amazon DynamoDB configure code");
return conn;
