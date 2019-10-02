# Datasource Provider Examples
In Layer7 Live API Creator 5.3, the Datasource Provider framework allows the design and development of
JavaScript code that will connect to and allow the query, insert, update, and delete of various REST, SQL and NoSQL endpoints.

## Instructions
```
1. Stop your Layer7 Live API Creator APIServer
2. Copy one or more selected example folders to your %REPOSITORY_HOME%/system/data_source_providers.
3. Restart your server.
4. Logon to APIServer as 'sa' and navigate to Datasource Provider tab to view the definitions.

In an existing API Datasource - the Add dialog will allow selection of one or these datasource providers.
```
## Example Folders
1. [InMemoryExample][https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/InMemoryExample] : A simple read only storage of user defined values.
2. [MySQL][https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/MySQL] : A JDBC example using MySQL driver.
3. [PetStore][https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/PetStore] : The PetStore example showing how to use the framework to call REST. 
4. [Rally][https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/Rally] : The Rally example using REST to define all endpoints.
5. [Runscope][https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/Runscope] : The Runscope example using REST to define endpoints.