@echo off

if [%1]==[] goto usage

echo.
echo ==========================================
echo ==== Verifying API Server, Logging in ====
echo ==========================================
echo.

set DevUrlName=%1
set ProdUrlName=%2

set DevServer="http://localhost:8080"
set ProdServer="http://localhost:8080"

echo.
echo.

set ProdServerFullURL=%DevServer%/rest/default/

echo.
echo ================================================
echo ==== Exporting %DevUrlName% to %DevUrlName%.json ===
echo ================================================
echo.

call lacadmin logout -a DevServerAlias
call lacadmin login -u admin -p Password1 %DevServer% -a DevServerAlias
call lacadmin api use --url_name %DevUrlName%
call lacadmin api export --file %DevUrlName%.json --format json
call lacadmin logout -a DevServerAlias

echo ..export compete ====


echo.
echo.
echo.
echo ========================================
echo ==== Creating Auth Provider
echo ========================================

call lacadmin logout -a ProdServerAlias
call lacadmin login -u admin -p Password1 %ProdServer% -a ProdServerAlias
call lacadmin api use --url_name %ProdUrlName%

call lacadmin authprovider create --auth_name AuthProviderFromDB --createFunction create --paramMap logonApiKey=Bzn8jVyfOTiIpW6UQCgy,loginBaseURL=%ProdServer%/rest/default/%ProdUrlName%/v1/nw:Employees,loginGroupURL=%ProdServer%/rest/default/%ProdUrlName%/v1/nw:Region --comments 'Uses Get Employees for REST Validation '
call lacadmin authprovider insertJSCode --auth_name AuthProviderFromDB --file authprovider-javascript/AuthProviderFromDB.js

echo.
echo.
echo.
echo =============================================
echo ==== Importing %DevUrlName%.json as url %ProdUrlName%
echo =============================================
echo.

call lacadmin api import --file %DevUrlName%.json  # imported project becomes current
call lacadmin status
call lacadmin api delete --url_name %ProdUrlName%
call lacadmin api update --url_name %ProdUrlName% --api_name API-%ProdUrlName%

echo.
echo imported: %ProdUrlName%


echo.
echo.
echo.
echo ===============================================
echo ==== Configure %ProdUrlName% AuthProvider, DataSource
echo ===============================================
echo.

call lacadmin authprovider linkProject --auth_name AuthProviderFromDB
echo ...linked to AuthProviderFromDB on %ProdUrlName%

rem Data Sources [optional] for other databases - set the password [unused in derby]
call lacadmin datasource update --prefix nw --password password1
call lacadmin datasource list
echo ...dataSource configured on %ProdUrlName%

echo.
echo .. configuration complete


echo.
echo.
echo.
echo ==================================================
echo ==== install complete - server status follows ====
echo ==================================================
echo.

call lacadmin status
call lacadmin libraries list
call lacadmin api list

######################################################################

echo.
echo.
echo.
echo =================================================
echo ==== Test Post an Order                      ====
echo ====   1 - First via testB2BAll api function ====
echo ====   2 - Then by simple lac post           ====
echo ================================================
echo.

call lac login -u demo -p Password1 http://localhost:8080/rest/default/b2bderbynw/v1 -a b2b
call lac use b2b

# this runs a full test suite (explore in API Creator)
call lac get testB2BAll

# Post an order to b2b Partner
call lac post PartnerOrder -j '{ "CustomerNumber": "VINET","Items": [ {"ProductNumber": 16, "Quantity": 1 },{"ProductNumber": 7,"Quantity": 2}, {"ProductNumber": 14, "Quantity": 3}, {"ProductNumber": 10, "Quantity": 4}, {"ProductNumber": 13, "Quantity": 5}  ] }'


echo.
echo.
echo.
echo =================================================================
echo ====  Verify B2B Processing:
echo ====    1 - Order from Partner created -- see above
echo ====    2 - Created order can found, and has proper values
echo ====    3 - Supplier Pavlov notified
echo ====    4 - Supplier can see promotions - only theirs, per row-level security
echo ====
echo ====  Using node and python --- see samples under scs/projects/test
echo =================================================================
echo.

:Node
version --version 2>NUL
if errorlevel 1 goto errorNoNode

node ./deployProdTests/node/post.js %ProdServerFullURL% %ProdUrlName%

node ./deployProdTests/node/verifyPost.js %ProdServerFullURL% %ProdUrlName%
REM this is a different url fragment than referenced by ProdUrlName
node ./deployProdTests/node/verifyPavlov.js %ProdServerFullURL% b2bderbypavlov
node ./deployProdTests/node/verifySupplier.js %ProdServerFullURL% %ProdUrlName%
node ./deployProdTests/node/empGiveRaiseFunction.js %ProdServerFullURL% %ProdUrlName%
node ./deployProdTests/node/testB2BAll.js %ProdServerFullURL% %ProdUrlName%

echo.
echo .. node tests complete..
echo.
goto :python

:errorNoNode
echo.
echo Note: NodeJS not found (or not configured), this verification step skipped (not a problem)


:python
python --version 2>NUL
if errorlevel 1 goto errorNoPython

python ./deployProdTests/python/verifyUsingHttplib.python %ProdServerFullURL% %ProdUrlName%
python ./deployProdTests/python/verifyUsingRequests.python %ProdServerFullURL% %ProdUrlName%

echo .. python tests complete
goto :php


:errorNoPython
echo.
echo Note: python not found (or not configured), this verification step skipped (not a problem)

:php

php -v 2>NUL
if errorlevel 1 goto errorNoPhp

php ./deployProdTests/php/verify.php %ProdServerFullURL% %ProdUrlName%
echo .. php tests complete

goto :the_end

:errorNoPhp
echo.
echo Note: php not found (or not configured), this verification step skipped (not a problem)
echo.

echo.
echo.
echo ==========================================================================================
echo ====  Verify complete - %ProdUrlName% installed and tested.       Please check status above ====
echo ====  .. Run in Browser: http://localhost:8080/http/default/b2bderbynw/B2B     ===========
echo ==========================================================================================
echo.

goto :the_end


:usage
  echo.
  echo.
  echo ==== Deploys 'dev' b2b to 'prod' b2b ====
  echo.
  echo     Purpose: illustrate 'Project Life Cycle' DevOps:
  echo         a. Extract Development API (devAPI) from devServer
  echo         b. Deploy to Production Server (prodServer)
  echo               -- here, for convenience, prodServer is same as devServer --
  echo         c. Configure prodServer
  echo.
  echo     Usage: sdeployProd.cmd DevUrlName ProdUrlName
  echo         where:
  echo              DevUrlName is the url name for the 'dev' API
  echo              ProdUrlName is the url name for the 'production' API
  echo          example:
  echo               deployProd.cmd b2bderbynw b2bAuth
  echo.
  echo     Actions (for example, above):
  echo         1. Exports DevAPI (b2bderbynw - the pre-installed b2b) into json
  echo         2. Deploys custom Auth Provider (lib/AuthProviderFromDB) to server
  echo         3. Imports #1 as ProdUrlName (b2bAuth)
  echo         4. Configures imported API:
  echo               a. Set DataSource Password
  echo               b. Use custom auth provider
  echo         5. Runs tests
  echo.
  echo.
  echo     See docs for other examples (e.g., cURL, etc.)
  echo.
  echo.
  echo     Prerequisites:
  echo         LAC must be installed and running, license accepted
  echo           -- presumes 'Jetty' version, pre-installed b2b
  echo         Requires lac/ladmin exe installs
  echo.
  echo.

:the_end
exit /b
