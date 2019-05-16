REM Windows Command file to create a new project using exported parts
REM SERVER=http://localhost:8080/APIServer -- WAR
SERVER=http://localhost:8080

REM  Connect to a local server
call lacadmin logout -a demo
call lacadmin login -u admin -p Password1 http://localhost:8080/ -a demo
call lacadmin status

call lacadmin project list
REM call lacadmin project import --file demo/demo.json
REM OR create a new project - delete if exists
call lacadmin project use --url_name newproj
call lacadmin project delete --url_name newproj
call lacadmin project create --project_name MyNewProject --url_name newproj
call lacadmin project use --url_name newproj

REM  Start Import
call lacadmin libraries import --file demo/libraries.json
call lacadmin authprovider import --file demo/authprovider.json
call lacadmin authprovider linkProject --ident 1000
call lacadmin apioptions import --file demo/apioptions.json
call lacadmin datasource import --file demo/datasource.json
call lacadmin datasource reload --prefix nw
call lacadmin relationship import --file demo/relationships.json
call lacadmin topic import --file demo/topic.json
call lacadmin rule import --file demo/rules.json 
call lacadmin resource import --file demo/resources.json
REM security info
call lacadmin role import --file demo/roles.json
call lacadmin token import --file demo/tokens.json
call lacadmin user import --file demo/users.json
REM other stuff
call lacadmin namedsort import --file demo/sorts.json
call lacadmin namedfilter import --file demo/filters.json
call lacadmin apiversion import --file demo/apiversions.json
call lacadmin event import --file demo/events.json
call lacadmin handler import --file demo/handlers.json
REM call lacadmin npa import --file demo/npa.json

call lacadmin project list
call lacadmin logout demo
