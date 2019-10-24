# FTP-Listener-Provider
A pluggable listener provider for Live API Creator that enables users to connect to an FTP server to listen to and/or to create files and directories.

# Supported Version
CA Live API Creator 5.3

## General usage
1. Connect to FTP servers and add listeners to directories and files. Perform operations based on changes to
 the remote FTP file system.
2. Change shared file directories via APIs from Live API Creator.

## Note 
This connector uses the support for Camel connectors in Live API Creator. For FTP, Live API Creator uses camel-ftp connector.
For more information about Camel-FTP connector, see the [Apache Camel documentation](https://camel.apache.org/ftp.html)  

## Install this Listener Provider
0. Stop Live API Creator if it is running. 
1. Download the camel-ftp connector JAR into a local directory. 
    1. File download [link](http://central.maven.org/maven2/org/apache/camel/camel-ftp/2.20.4/)
2. If you are using the [Live API Creator Single-User Demonstration Package](https://docops.ca.com/ca-live-api-creator/5-2/en/installing-and-upgrading/install-the-single-user-demonstration-package), 
copy the downloaded jar to the following directory:
    ```
    /<Demo Package Home>/CALiveAPICreator/webapps/CALiveAPICreator/WEB-INF/lib
    ```
3. **OR** If you have deployed Live API Creator as a WAR file in any of the application servers that Live API Creator supports, repackage the WAR file with the following camel-ftp downloaded jar:
    ```
    jar -uvf CALiveAPICreator.<Version>.war /path/to/lib/camel-ftp-2.20.4.jar
    ```
4. Navigate to the Live API Creator admin repository and to the following path:
```
/<Repository Home>/system/listener_providers
```
5. Copy the directory **FTP** in this repository.
6. Start Live API Creator.

## Validate the Installation
Complete the following steps to verify that you installed the FTP listener provider successfully:
0. Log in to API Creator as a system administrator (sa).
1. Click the **Listener Providers** tab.
2. In the Listener Providers list, **FTP** should be visible.
3. Log out and log back in as an administrator (admin).
4. Create a simple API using the Code-first approach to creating APIs.
5. Click **Listeners**.
3. Create a connection. In the **Connection type** drop-down, the **FTP** option should be visible.
