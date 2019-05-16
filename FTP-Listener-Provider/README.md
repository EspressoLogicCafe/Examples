# FTP-Listener-Provider
A pluggable listener provider for Live API Creator that would enable users to connect to an FTP server to listen to and/or to create files and directories.

# Supported Version
CA Live API Creator 5.3

## General usage
1. Connect to FTP servers and add listeners to directories and files. Perform operations based on changes t
 the remote FTP file system.
2. Change shared file directories via APIs from Live API Creator.

## Note 
This connector utilizes the support for Camel connectors in Live API Creator. For FTP, we use camel-ftp connector.
For more information about Camel-FTP connector, see the [official documentation](https://camel.apache.org/ftp.html)  

## Installation steps
0. Stop Live API Creator if it is running. 
1. Download the camel-ftp connector JAR into a local directory. 
    1. File download [link](http://central.maven.org/maven2/org/apache/camel/camel-ftp/2.20.4/)
2. If you are using [Live API Creator Single-User Demonstration Package](https://docops.ca.com/ca-live-api-creator/5-2/en/installing-and-upgrading/install-the-single-user-demonstration-package) , 
copy the downloaded jar to 
    ```
    /<Demo Package Home>/CALiveAPICreator/webapps/CALiveAPICreator/WEB-INF/lib
    ```
3. **OR** If you have deployed Live API Creator as a WAR file in any of the supported application servers, 
repackage the WAR file with the camel-ftp downloaded jar.
    ```
    jar -uvf CALiveAPICreator.<Version>.war /path/to/lib/camel-ftp-2.20.4.jar
    ```
4. Navigate to your Live API Creator Admin repository and the path below
```
/<Repository Home>/system/listener_providers
```
5. Copy the directory **FTP** in this repository to the above folder
6. Start Live API Creator

## Validate Installation
Perform the below steps to check if FTP listener provider was installed successfully.
0. Login as System Administrator (sa)
1. Click the tab **Listener Providers** in the home page
2. In the select box, **FTP** should be visible.
3. Logout and Login as Administrator (admin)
4. Create a Simple API after choosing Code First. 
5. Navigate to Listeners
3. Create a New Connection and in the **Connection type** drop down, option to add an  **FTP** connection 
 should be visible. 
