#! /bin/bash

# Copy your platform specific version of 'lac'
# to the directory that you will execute this script.
# Live API Creator meta @ rest endpoints
## add  --format json for a full JSON response

#logon to a specific server and API project
SERVER=http://localhost:8080/rest/default/b2bderbynw/v1
# echo 1
# Note that the URL contains the entire path to the project
./lac login -u demo -p Password1 $SERVER -a demo
./lac use demo

# Show the current license info (add --format json) for full EULA
./lac get @license

# returns OK if server is up
./lac get @heartbeat

# Show All Tables and columns for selected table
./lac get @tables
./lac get @tables/nw:Customers

# Show All views and columns for selected view
./lac get @views
./lac get @views/nw:Current%20Product%20List


# Show All Store Proc and attribute for sele

./lac get @procedures
# ./lac get @procedures/somename

# Show All Resoures and attribute for selected resources (using ident)
./lac get @resources
#./lac get @resources/2000


# List of Rules
./lac get @rules

# API Project settings
./lac get @apioptions

# Information on the default auth provider
#./lac get @auth_provider_info/{ident}

# Swagger 2.0 doc format
./lac get @docs --format json > b2bswagger.json
echo b2bswagger.json created for Swagger 2.0

./lac logout
