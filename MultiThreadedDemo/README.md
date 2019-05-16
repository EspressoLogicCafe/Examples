# MultiThreadedDemo

This example demonstrates how a user can call multiple REST Endpoints from LAC using the Java Concurrent Executors framework.

Using the Java Concurrent Executors framework we are able to execute multiple requests in parallel. This would radically improve the response time of the combined API.

The sample REST endpoint used in this example is a Live API Creator 'Custom Endpoint' that has a sleep of 1 second.

In this example, we provide two functions:

**SequentialAccess** - This function calls a rest endpoint 10 times and combines each response before providing the response to the client. In this function the individual API call is performed in sequence one after another.

**ParallelAccess** -  This function calls a rest endpoint 10 times and combines each response before providing the response to the client. In this function however individual API calls are performed in parallel to each other.

# Install the API Example
- On a running instance of Live API Creator, import the config/threads.zip ZIP file. A new API is created

