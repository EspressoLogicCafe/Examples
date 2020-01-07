# Data Source Provider Examples
In Layer7 Live API Creator 5.3, the extensible data source provider framework allows the design and development of
JavaScript code that connects to and allows the query, insert, update, and delete of various REST, SQL, and NoSQL endpoints.

## Instructions
```
1. Stop API Server.
2. Copy one or more selected example folders to your %REPOSITORY_HOME%/system/data_source_providers directory.
3.(Optional) Copy the appropriate JDBC or other JAR file(s) needed for the data source.
4. Restart API server.
5. Log in to API Creator as a system administrator (sa).
6. Navigate to the Data Source Providers tab to view the data source provider definitions.

In an existing API data source, you can add a data source that uses a data source provider.
```
## Example Folders
1. [InMemoryExample](https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/InMemoryExample): This example demonstrates how to manually create a model (or structure) that includes a couple of tables and relationships.
2. [MySQL](https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/MySQL): This example is a complete JDBC example for MySQL.
3. [PetStore](https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/PetStore): This example demonstrates how to use the framework to call REST. 
4. [Rally](https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/Rally): This example demonstrates using REST to define all endpoints.
5. [Runscope](https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/Runscope): This example demonstrates using REST to define endpoints.
6. [CDatq CSV/TSV](https://github.com/EspressoLogicCafe/Examples/tree/master/DatasourceProvider/CDataCSV): This example uses the CData CSV/TSV driver (read-only).
