REM Export a project example into smaller JSON parts
REM
REM Live API Creator -Command Line Tools
REM Copy your platform specific version of 'lac'
REM to the directory that you will execute this script.
REM Export the API Project contents for an existing API Server
REM
REM SERVER=http://localhost:8080/APIServer
SERVER=http://localhost:8080
REM  Connect to a local server
call lacadmin logout -a demo
call lacadmin login -u admin -p Password1 http://localhost:8080 -a demo
call lacadmin use demo
call lacadmin status

REM  Select a Project
call lacadmin project use --url_name demo

REM  Export everything
mkdir -p demo

call lacadmin project export --file demo/nwind.json
call lacadmin apioptions export --file demo/apioptions.json
call lacadmin datasource export --file demo/datasource.json
call lacadmin libraries export --file demo/libraries.json
call lacadmin authprovider export --file demo/authprovider.json
call lacadmin rule export --file demo/rules.json 
call lacadmin resource export --file demo/resources.json
call lacadmin relationship export --file demo/relationships.json
call lacadmin token export --file demo/tokens.json
call lacadmin role export --file demo/roles.json
call lacadmin user export --file demo/users.json
call lacadmin namedsort export --file demo/sorts.json
call lacadmin namedfilter export --file demo/filters.json
call lacadmin apiversion export --file demo/apiversions.json
call lacadmin event export --file demo/events.json
call lacadmin handler export --file demo/handlers.json
call lacadmin topic export --file demo/topic.json
REM call lacadmin npa export --file demo/npa.json

call lacadmin logout -a demo
