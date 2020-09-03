#!/bin/bash
export EL_SETUP=target
export EL_JAVA=${EL_SETUP}/lib
export EL_CLASSPATH=\
${EL_SETUP}:\
${EL_SETUP}/MigrationService.jar:\
${EL_JAVA}/commons-codec-1.9.jar:\
${EL_JAVA}/commons-io-1.3.2.jar:\
${EL_JAVA}/commons-lang3-3.5.jar:\
${EL_JAVA}/commons-lang3-3.2.1.jar:\
${EL_JAVA}/commons-logging-1.2.jar:\
${EL_JAVA}/jersey-apache-client-1.17.1.jar:\
${EL_JAVA}/jersey-client-1.17.1.jar:\
${EL_JAVA}/jersey-core-1.17.1.jar:\
${EL_JAVA}/jackson-databind-2.2.3.jar:\
${EL_JAVA}/jackson-annotations-2.2.3.jar:\
${EL_JAVA}/jackson-core-2.2.3.jar:\
${EL_JAVA}/slf4j-api-1.6.3.jar:\
${EL_JAVA}/json-simple-1.1.1.jar:\

#echo ${EL_CLASSPATH}
java -cp ${EL_CLASSPATH} MigrationService $1 $2 $3 $4 $5