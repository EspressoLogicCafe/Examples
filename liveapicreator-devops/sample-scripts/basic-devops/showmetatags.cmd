REM Meta Tag List
REM Copy your platform specific version of 'lac'
REM to the directory that you will execute this script.
REM  Live API Creator meta @ rest endpoints

REM SERVER=http://localhost:8080/APIServer/rest/default/nwindb2b/v1
REM echo 1
REM  Note that the URL contains the entire path to the project 
call lac login -u demo -p Password1 http://localhost:8080/APIServer/rest/default/nwindb2b/v1 -a localnw
call lac use localnw

REM Show the current license info (add --format json) for full EULA
call lac get @license

REM returns OK if server is up
call lac get @heartbeat

REM  Show All Tables and columns for selected table
call lac get @tables
call lac get @tables/nw:Customers

REM  Show All views and columns for selected view
call lac get @views
call lac get @views/nw:Current%20Product%20List

REM  Show All Resoures and attribute for selected resources (using ident)
call lac get @resources
REM call lac get @resources/2000

REM  Show All Store Proc and attribute for selected proc (using ident)
call lac get @procedures
REM call lac get @procedures/somename

REM List of Rules
call lac get @rules

REM API Project settings
call lac get @apioptions

REM Information on the default auth provider
call lac get @auth_provider_info/1000

REM  Swagger 2.0 doc format
call lac get @docs --format json

call lac logout
