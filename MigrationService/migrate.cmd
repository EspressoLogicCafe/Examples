REM Windows migration shell script
set EL_SETUP=target
set EL_JAVA=%EL_SETUP%\lib
set EL_CLASSPATH=%EL_JAVA%

set EL_CLASSPATH=%EL_CLASSPATH%;%EL_SETUP%\MigrationService.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\commons-codec-1.9.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\commons-io-1.3.2.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\commons-lang3-3.5.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\commons-lang3-3.2.1.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\commons-logging-1.2.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\jersey-apache-client-1.17.1.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\jersey-client-1.17.1.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\jersey-core-1.17.1.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\jackson-databind-2.2.3.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\jackson-annotations-2.2.3.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\jackson-core-2.2.3.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\slf4j-api-1.6.3.jar
set EL_CLASSPATH=%EL_CLASSPATH%;%EL_JAVA%\json-simple-1.1.1.jar

echo %EL_CLASSPATH%
java -cp %EL_CLASSPATH% MigrationService %1 %2 %3 %4 %5