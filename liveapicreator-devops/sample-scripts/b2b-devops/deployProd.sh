#! /bin/bash

if [ $# -lt 2 ]
then
  echo " "
  echo " "
  echo "==== Deploys 'dev' api to 'prod' api (this example using B2B) ===="
  echo " "
  echo "    Purpose: illustrate 'Project Life Cycle' DevOps:"
  echo "        a. Extract Development API (devAPI) from devServer"
  echo "              -- for your projects, you might start with an SCS pull --"
  echo "        b. Deploy to Production Server (prodServer)"
  echo "              -- here, for convenience, prodServer is same as devServer --"
  echo "        c. Configure prodServer"
  echo "        d. Run some sanity tests to ensure system is operational"
  echo "              -- typical of a nightly build and test --"
  echo " "
  echo "    Usage: sh deployProd.sh <DevUrlName> <ProdUrlName>  <verify> [ <DevServer> <ProdServer>]"
  echo "        where:"
  echo "             DevUrlName is the url name for the 'dev' API"
  echo "             ProdUrlName is the url name for the 'production' API"
  echo "             verify means run language verification apps (node, python, ...)"
  echo "             DevServer is server address (optional, default is http://localhost:8080"
  echo "             ProdServer is server address (optional, default is http://localhost:8080"
  echo "         example:"
  echo "              sh deployProd.sh b2bderbynw b2bAuth"
  echo " "
  echo "    Actions (for example, above):"
  echo "        1. Exports DevAPI (b2bderbynw - the pre-installed b2b) into json"
  echo "        2. Deploys custom Auth Provider (lib/AuthProviderFromDB) to server"
  echo "        3. Imports #1 as ProdUrlName (b2bAuth)"
  echo "        4. Configures imported API:"
  echo "              a. Set DataSource Password"
  echo "              b. Use custom auth provider"
  echo "        5. Runs tests"
  echo " "
  echo " "
  echo "    See docs for other approaches (e.g., cURL, etc.)"
  echo " "
  echo " "
  echo "    Prerequisites:"
  echo "        LAC must be installed and running, license accepted"
  echo "          -- presumes 'Jetty' version, pre-installed b2b"
  echo "        Requires lac/ladmin exec installs"
  echo " "
  echo " "
  exit
fi

echo " "
echo =============================================
echo ==== Checking versions for lac, lacadmin ====
echo =============================================
echo

# lac --version
lacVersion=$(lac --version)
lacAdminVersion=$(lacadmin --version)
lacadmin --version &> /dev/null
cliOK=$?

if [ $cliOK -eq 0 ]
then
  echo "..CLI verified (lacadmin version: $lacAdminVersion, lac: $lacVersion)"
else
  echo "==> lacadmin does not appear to be installed ($cliOK)"
  echo "====> exiting..."
  echo " "
  exit 1
fi


echo
echo ==========================================
echo ====           License                ====
echo ==========================================
echo


lacadmin license list
echo "..license accepted, proceeding..."
echo " "


echo
echo ==========================================
echo ==== Verifying API Server, Logging in ====
echo ==========================================
echo

DevUrlName=$1
ProdUrlName=$2

DevServer="http://localhost:8080"

if [ $# -gt 3 ]
then
  DevServer=$4
  echo "..using specified DevServer $DevServer"
else
  echo "..using default DevServer $DevServer"
fi
ProdServer="http://localhost:8080"
if [ $# -gt 3 ]
then
  ProdServer=$5
  echo "..using specified ProdServer $ProdServer"
else
  echo "..using default ProdServer $ProdServer"
fi

echo " "
echo " "

ProdServerFullURL=$DevServer"/rest/default/"


echo
echo ================================================
echo ==== Exporting ${DevUrlName} to ${DevUrlName}.json ===
echo ================================================
echo

lacadmin logout -a DevServerAlias
# example: lacadmin login -u admin -p Password1 http://localhost:8080 -a MyAlias
lacadmin login -u admin -p Password1 $DevServer -a DevServerAlias
lacadmin api use --url_name ${DevUrlName}
lacadmin api export --file ${DevUrlName}.json --format json
lacadmin logout -a DevServerAlias

echo ..export compete ====


echo
echo
echo
echo ========================================
echo ==== Creating Auth Provider
echo ========================================

lacadmin logout -a ProdServerAlias
lacadmin login -u admin -p Password1 $ProdServer -a ProdServerAlias

lacadmin authprovider create --auth_name AuthProviderFromDB --createFunction create --paramMap logonApiKey=Bzn8jVyfOTiIpW6UQCgy,loginBaseURL=${ProdServer}/rest/default/${ProdUrlName}/v1/nw:Employees,loginGroupURL=${ProdServer}/rest/default/${ProdUrlName}/v1/nw:Region --comments 'Uses Get Employees for REST Validation '
lacadmin authprovider insertJSCode --auth_name AuthProviderFromDB --file authprovider-javascript/AuthProviderFromDB.js

echo
echo
echo
echo =============================================
echo ==== Importing ${DevUrlName}.json as url ${ProdUrlName}
echo =============================================
echo 

lacadmin api import --file ${DevUrlName}.json  # imported project becomes current
lacadmin status
lacadmin api delete --url_name ${ProdUrlName}
lacadmin api update --url_name ${ProdUrlName} --api_name API-${ProdUrlName}

echo
echo "imported: ${ProdUrlName}"


echo
echo
echo
echo ===============================================
echo ==== Configure ${ProdUrlName} AuthProvider, DataSource
echo ===============================================
echo 

lacadmin authprovider linkProject --auth_name AuthProviderFromDB
echo "...linked to AuthProviderFromDB on ${ProdUrlName}"

# Data Sources [optional] for other databases - set the password
lacadmin datasource update --prefix nw --password password1 ## Jetty does not use pwd
lacadmin datasource list

echo "...dataSource configured on ${ProdUrlName}"

echo
echo .. configuration complete


echo
echo
echo
echo ==================================================
echo ==== install complete - server status follows ====
echo ==================================================
echo

lacadmin status
lacadmin libraries list
lacadmin api list

######################################################################


echo
echo
echo
echo =================================================
echo ==== Test Post an Order using LAC CLI        ====
echo ====   1 - First via testB2BAll api function ====
echo ====   2 - Then by simple lac post           ====
echo ================================================
echo

lac login -u demo -p Password1 http://localhost:8080/rest/default/b2bderbynw/v1 -a b2b
lac use b2b

# this runs a full test suite (explore in API Creator)
lac get testB2BAll -m json > testB2Ball.json

if grep -q '"Result": "Success"' testB2Ball.json
then
  echo === success - testB2BAll
else
  echo === failure -- see testB2Ball.json
  exit 1
fi


# Post an order to b2b Partner
lac post PartnerOrderUsingLookups -j \
'{ "Customer": "VINET", "Shipper":  "Pavlovia", "Items": [ { "Product": "Chai", "Quantity": 1}, { "Product": "Chang", "Quantity": 2}]}' \
-m json > postResponse.json

if grep -q '"statusCode": 201' postResponse.json
then
  echo === success - PartnerOrderUsingLookups
else
  echo === failure -- see postResponse.json
  exit 1
fi


if [ "$3" != "verify" ]
then
  echo
  echo
  echo
  echo ======================================================
  echo ==== Lanaguage verification examples not selcted  ====
  echo ======================================================
  echo
else

  echo
  echo
  echo
  echo =================================================================
  echo ====  Verify B2B Processing:
  echo ====    1 - Order from Partner created -- see above
  echo ====    2 - Created order can be found, and has proper values
  echo ====    3 - Supplier Pavlov notified
  echo ====    4 - Supplier can see promotions - only theirs, per row-level security
  echo ====
  echo ====  Using node and python --- see samples under scs/projects/test
  echo =================================================================
  echo
  # echo verify args: $1, $2

  # post an order using Node (if Node not found, print message and return 1)
  # eg: node ./deployProdTests/node/post.js http://localhost:8080/rest/default/ b2bAuth

  node  -e "var i = 0"
  if [ $?  -ne 0 ]
  then
    echo Node not found - unable to run node verify tests
  else
    echo Node found - running tests
    # FIXME node ./deployProdTests/node/post.js $ProdServerFullURL ${ProdUrlName}
    node ./deployProdTests/node/verifyPost.js $ProdServerFullURL ${ProdUrlName}
    # this is a different url fragment than referenced by ProdUrlName
    node ./deployProdTests/node/verifyPavlov.js $ProdServerFullURL b2bderbypavlov
    node ./deployProdTests/node/verifySupplier.js $ProdServerFullURL ${ProdUrlName}
    node ./deployProdTests/node/empGiveRaiseFunction.js $ProdServerFullURL ${ProdUrlName}
    node ./deployProdTests/node/testB2BAll.js $ProdServerFullURL ${ProdUrlName}
    fi

  python -c "i = 0"
  if [ $?  -ne 0 ]
  then
    echo Python not found
  else
    echo " "
    echo Python found, running tests with ProdServerFullURL: ${ProdServerFullURL}, ProuUrlName: ${ProdUrlName}
    python ./deployProdTests/python/verifyUsingHttplib.python http://localhost:8080/rest/default/ b2bAuth
    python ./deployProdTests/python/verifyUsingHttplib.python $ProdServerFullURL ${ProdUrlName}
    python ./deployProdTests/python/verifyUsingRequests.python $ProdServerFullURL ${ProdUrlName}
  fi

  perl -e '$i=0;'
  if [ $?  -ne 0 ]
  then
    echo Perl not found
  else
   echo " "
   echo "Perl - under construction"
    # UNDER CONSTRUCTION perl ./scs/projects/test/perl/verify.perl $ProdServerFullURL ${ProdUrlName}
  fi

  php -r '$i = 0;'
  if [ $?  -ne 0 ]
  then
    echo php not found
  else
    php ./deployProdTests/php/verify.php $ProdServerFullURL ${ProdUrlName}
  fi
fi
echo
echo
echo ===================================================================================
echo ====  Verify complete - ${ProdUrlName} installed and tested.       Please check status above ====
echo ====  .. Run in Browser: http://localhost:8080/http/default/b2bderbynw/B2B     =========
echo ===================================================================================
echo

exit 0
