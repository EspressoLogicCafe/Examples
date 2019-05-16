#! /bin/bash
##
# Copy your platform specific version of 'lacadmin'
# to the directory that you will execute this script.
# Generate the API Project contents for an existing API Server
##
#LACSERVER=http://localhost:8080
# Use this server profile for WAR File
# LACSERVER=http://localhost:8080/APIServer
PROJECT=demo

## Connect to a local server $LACSERVER and use API Project $PROEJCT
./lacadmin logout -a admin
./lacadmin login -u admin -p Password1 http://localhost:8080 -a admin
./lacadmin use admin
# Select and use a Project URL
./lacadmin api use --url_name $PROJECT

./lacadmin status

# List out ALL projects for the TeamSpace logon
./lacadmin api list

# list out each of the repository or API content
./lacadmin apioptions list
./lacadmin datasource list
./lacadmin libraries list
./lacadmin authprovider list
./lacadmin rule list
./lacadmin resource list
./lacadmin relationship list
./lacadmin token list
./lacadmin role list
./lacadmin user list
./lacadmin namedsort list
./lacadmin namedfilter list
./lacadmin apiversion list
./lacadmin event list
./lacadmin handler list
./lacadmin topic list
./lacadmin npa list
./lacadmin gateway list
./lacadmin connection list
./lacadmin listener list
./lacadmin timer list
./lacadmin function list
./lacadmin custom_endpoint list
./lacadmin managedserver list
./lacadmin teamspace list
./lacadmin teamspace_user list

# close connection and cleanup
./lacadmin logout -a admin
