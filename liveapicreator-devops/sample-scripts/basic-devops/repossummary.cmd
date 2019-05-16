REM Generate the contents of an existing repository
REM Copy your platform specific version of 'call lacadmin'
REM to the directory that you will execute this script.
REM Generate the API Project contents for an existing API Server
REM

REM List out ALL projects for the TeamSpace logon
call lacadmin api list

REM Select and use a Project URL
call lacadmin api use --url_name $PROJECT

call lacadmin apioptions list
call lacadmin datasource list
call lacadmin libraries list
call lacadmin authprovider list
call lacadmin rule list
call lacadmin resource list
call lacadmin relationship list
call lacadmin token list
call lacadmin role list
call lacadmin user list
call lacadmin namedsort list
call lacadmin namedfilter list
call lacadmin apiversion list
call lacadmin event list
call lacadmin handler list
call lacadmin topic list
call lacadmin npa list
call lacadmin gateway list
call lacadmin connection list
call lacadmin listener list
call lacadmin timer list
call lacadmin function list
call lacadmin custom_endpoint list
call lacadmin managedserver list
call lacadmin teamspace list
call lacadmin teamspace_user list

# close connection and cleanup
call lacadmin logout -a $PROJECT
