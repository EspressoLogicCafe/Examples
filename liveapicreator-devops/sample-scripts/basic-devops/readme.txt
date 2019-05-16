CA Live API Creator provides developers and admins a set of tools to manage repository components

Copy the 'lac' and 'lacadmin' files from the directory that represents the platform you are executing
these scripts ('windows', 'linux', 'macos')

Local Documentation:
lacadmin --help
lacadmin [option] --help
lac --help
lac [option] --help

Sample DevOp Scripts
repossummary[.sh | .cmd] - a script that runs a list report for each component in the specified API project
export_project[.sh | .cmd] - a script that exports an API Project and each of its JSON components into a sub-directory
import_to_new_project[.sh | .cmd] - a devops script to create a new API project and import JSON components

Using the command 'lacadmin api export'- you will get the entire API project in a single JSON or ZIP file.
lacadmin api export --file my_api.json --format json --passwordstyle plaintext
lacadmin api import --file my_api.zip --format zip --passwordstyle encrypted

