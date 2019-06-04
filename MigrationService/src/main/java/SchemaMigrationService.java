import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class SchemaMigrationService {

	protected Map<String, String> headers = new HashMap<>();

	private static final String AUTHENTICATION = "@authentication";

	private static String osName;
	protected static String APIKEY = null;
	private static String adminUser = "sa";
	private static String lacUser = "admin";
	private static String lacPassword = "Password1";
	private static String adminPassword = "Password1";
	private static boolean firstTeamspace = true;
	private static String hostNameAndPort = "http://localhost:8080";
	protected String ALLOWED_METHODS_ALL = "GET, POST, PUT, DELETE, OPTIONS";
	public static String BASE_HOST_FRAGMENT = "http://localhost:8080";
	public static String PROJECT_URI = BASE_HOST_FRAGMENT + "/rest/default/demo/v1";
	private static String OS_COMMAND = "lac";
	private static String COMMENT_LINE = "# ";
	private static StringBuilder exportSB = new StringBuilder();
	private static String fileExtension = ".sh";
	private static String filePathSeparator = File.separator;
	private static String masterDirectoryName = "schema" + filePathSeparator;
	private static String sourcePrefix = "demo";
	private static String targetPrefix = "demo";
	private static String sourceProjectUrl = "demo";

	public SchemaMigrationService() {
		headers.put("Content-Type", "application/json");
		headers.put("Accept", "application/json");
	}

	public static void main(String[] args) {
		if (args.length > 0 && args.length != 5) {
			printExportMessage("MigrationService usage:");
			printExportMessage(" arg1 = hostName and Port (http://localhost:8080)");
			printExportMessage(" arg2 = TeamSpace username(default: admin) ");
			printExportMessage(" arg3 = TeamSpace password (default: Password1)");
			printExportMessage(" arg4 = Project URL (default: demo) ");
			printExportMessage(" arg5 = Datasource Prefix (default: demo)");
			System.out.println(exportSB.toString());
			System.exit(1);
		}
		String sep;
		if (args.length == 5) {
			hostNameAndPort = args[0];        //args1 = hostNameAndPort (http://localhost:8080)
			lacUser = args[2];                //arg2 = lacUser (admin)
			lacPassword = args[3];            //arg3 = lacPassword (Password1)
			sourceProjectUrl = args[4];
			sourcePrefix = args[5];
			sep = (hostNameAndPort.endsWith("/")) ? "" : "/";
			BASE_HOST_FRAGMENT = hostNameAndPort + sep + "rest/abl/admin/v2/";
			PROJECT_URI = hostNameAndPort + sep + "rest/default/" + sourceProjectUrl + "/v1";
		}

		SchemaMigrationService schemaMigrationService = new SchemaMigrationService();
		schemaMigrationService.setupOSEnvironment();
		StringBuilder importSB = new StringBuilder();
		addExportHeader(exportSB);
		addImportHeader(importSB);
		printExportMessage(COMMENT_LINE + "OS: " + System.getProperty("os.name"));
		try {
			schemaMigrationService.getApiKey();
			printExportMessage(COMMENT_LINE + "Start Export Data source Prefix:" + sourcePrefix);
			printExportMessage(OS_COMMAND + " login -u " + lacUser + " -p " + lacPassword + " " + PROJECT_URI);
			printExportMessage(OS_COMMAND + " schema export --prefix " + sourcePrefix + " --file schemas/SCHEMA_" + sourcePrefix + ".json"); //--project_ident project_ident
			createImportProject(importSB);
			schemaMigrationService.migratetSchema(importSB);
			importSB.append("lacadmin schema create --skiptablecreation true  --file schemas/SCHEMA_demo.json --prefix [prefix]\n");
			schemaMigrationService.logoutScript(importSB);
			printExportMessage(OS_COMMAND + " logout");
			importSB.append("lacadmin logout\n");
			importSB.append("\n");
		}
		catch (Exception e) {
			System.err.println(e.getMessage());
			e.printStackTrace();
			System.exit(-1);
		}
		//Print out all the scripts
		writeExportFile(exportSB.toString());
		writeImportFile(importSB.toString());

		System.out.println("SchemaExport-1" + fileExtension + " and your SchemaImport-2" + fileExtension + " scripts written to this directory");
	}

	private static void createImportProject(final StringBuilder importSB) {
		importSB.append(COMMENT_LINE + "Start Import Data source Prefix:" + sourcePrefix + "\n");
		importSB.append(OS_COMMAND + " login -u " + lacUser + " -p " + lacPassword + " " + PROJECT_URI + "\n");
		importSB.append("lacadmin login -u admin -p Password1 http://localhost:8080/\n");
		importSB.append("lacadmin api use --url_name [project_url]\n");
		importSB.append("lacadmin schema create --skiprelationships true  --file schemas/SCHEMA_demo.json --prefix [prefix]\n");
	}

	private static void setupOSEnvironment() {
		osName = System.getProperty("os.name").toLowerCase();
		if (osName.contains("windows")) {
			OS_COMMAND = "windows\\lac.exe";
			COMMENT_LINE = "REM ";
			fileExtension = ".cmd";
		}
		else if (osName.contains("mac")) {
			OS_COMMAND = "macos/lac";
			COMMENT_LINE = "# ";
		}
		else if (osName.contains("linux")) {
			OS_COMMAND = "linux/lac";
			COMMENT_LINE = "# ";
		}
	}

	private static void addExportHeader(final StringBuilder sb) {
		sb.append(COMMENT_LINE + "===============================================================\n");
		sb.append(COMMENT_LINE + " EXPORT Schema Script\n");
		sb.append(COMMENT_LINE + " The schemas directory will hold the @schema file for your\n");
		sb.append(COMMENT_LINE + " data source and all the tables as JSON files.\n");
		sb.append(COMMENT_LINE + "===============================================================\n");
		sb.append("\n");
		if (osName.contains("windows")) {
			sb.append("if not exist \"schema\" mkdir schemas\n");
		}
		else {
			sb.append("mkdir -p schemas\n");
		}
	}

	private static void addImportHeader(final StringBuilder sb) {
		sb.append(COMMENT_LINE + "================================================================\n");
		sb.append(COMMENT_LINE + " IMPORT Schema Script\n");
		sb.append(COMMENT_LINE + " The schemas directory has @schema and JSON data files.\n");
		sb.append(COMMENT_LINE + " Please change script [preifx] and lacadmin target host\n");
		sb.append(COMMENT_LINE + " To use: set the isEditable=true data source prefix on the target project\n");
		sb.append(COMMENT_LINE + " \n");
		sb.append(COMMENT_LINE + " lacadmin managedserver create --server_name foo --user_name DerbyMDS --password blee \n");
		sb.append(COMMENT_LINE + "       --url 'jdbc:derby:directory:ManagedData;create=true' \n");
		sb.append(COMMENT_LINE + "     --active true --dbasetype derby \n");
		sb.append(COMMENT_LINE + " lacadmin managedserver list \n");
		sb.append(COMMENT_LINE + " lacadmin datasource createDatabase --active true --prefix bar --managedserver_ident 2000 --schema_editable true \n");
		sb.append(COMMENT_LINE + " \n");
		sb.append(COMMENT_LINE + "================================================================\n");
	}

	private static void writeExportFile(final String str) {
		writeFile("SchemaExport-1" + fileExtension, str);
	}

	private static void writeImportFile(final String str) {
		writeFile("SchemaImport-2" + fileExtension, str);
	}

	private static void writeFile(final String filename, final String str) {
		File f = new File(filename);
		final byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
		String fullPath = f.getAbsolutePath();
		Path filePath = f.toPath();
		try {
			Files.write(filePath, bytes);
		}
		catch (Exception ex) {
			ex.printStackTrace();
			System.err.println("Unable to write file " + filename);
		}
	}

	public void migratetSchema(StringBuilder sb) throws Exception {
		List<String> tables = findAllTables();
		sb.append(COMMENT_LINE + "Start import\n");
		//sb.append(COMMENT_LINE + OS_COMMAND + " post --file " + masterDirectoryName + "AllProjects" + account_ident + ".zip --namecollision replace_existing\n");
		for (String table : tables) {
			printExportMessage(OS_COMMAND + " get  " + table + " --pagesize 999  --format json --inlinelimit 1000000--nometa true  --jsonfile schemas" + filePathSeparator + "DATA_" + clean(table) + ".json");
			sb.append(OS_COMMAND + " post  " + table + " --jsonfile schemas" + filePathSeparator + "DATA_" + clean(table) + ".json\n");
		}
	}

	private String getProjectIdent() throws Exception {
		String ident = null;

		return ident;
	}

	private List<String> findAllTables() throws Exception {
		String endpointName = "/@tables";
		List<String> tables = new ArrayList<>();
		String jsonString = restGet(PROJECT_URI + endpointName, APIKEY);
		JSONArray array = asJsonOArrayt(jsonString);
		if (null != array && array.size() == 0) {
			return tables;
		}
		for (int i = 0; i < array.size(); i++) {
			Object name = ((JSONObject)array.get(i)).get("entity");
			Object prefix = ((JSONObject)array.get(i)).get("prefix");
			if (((String)prefix).equals(sourcePrefix)) {
				tables.add((String)name);
			}
		}
		return tables;
	}

	private void logoutScript(StringBuilder sb) {
		sb.append(OS_COMMAND + " logout\n");
	}

	private void logonScript(StringBuilder sb) {
		printExportMessage(OS_COMMAND + " logout");
		logoutScript(sb);
		printExportMessage(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort);
		sb.append(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort + "\n");
		if (osName.equals("linux")) {
			printExportMessage(COMMENT_LINE + " linux bug requires 2nd login");
			printExportMessage(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort);
			sb.append(COMMENT_LINE + "Linux bug requires 2nd login \n");
			sb.append(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort + "\n");
		}
	}

	private String clean(String name) {
		String result = name.replace(" ", "_");
		result = result.replace("(", "");
		result = result.replace(")", "");
		result = result.replace("/", "_");
		result = result.replace("$", "");
		result = result.replace("%", "");
		return result + "_" + sourcePrefix;
	}

	private static String escapeSQL(String question) {
		String resp = question.replaceAll("\"", "'");
		return resp.trim();
	}

	public String getAPIKey(String uri, String _username, String _password) throws Exception {

		String payload = "{\"username\": \"" + _username + "\", \"password\":\"" + _password + "\"}";

		Client client = Client.create();
		ClientResponse clientResponse;

		clientResponse = setHttpHeaders(client.resource(uri))
				.post(ClientResponse.class, payload);

		evalClientResponse(clientResponse);
		String resp = clientResponse.getEntity(String.class);
		ObjectMapper mapper = new ObjectMapper();
		JsonNode json = mapper.readTree(resp);
		String apikey = json.get("apikey").textValue();
		return apikey;
	}

	public String restGet(String uri, int pagesize, int offset, String anApiKey) throws Exception {
		return restGet(uri + "?pagesize=" + pagesize + "&offset=" + offset + "&nometa=true", anApiKey);
	}

	public String restGet(String uri, String anApiKey) throws Exception {
		Client client = Client.create();
		ClientResponse clientResponse;

		String auth = "CALiveAPICreator " + anApiKey + ":1";

		clientResponse = setHttpHeaders(client.resource(uri))
				.header("Authorization", auth)
				.header("Accept", headers.get("Accept"))
				.get(ClientResponse.class);
		if (!evalClientResponse(clientResponse)) {
			System.err.println(uri);
			throw new Exception("Error " + clientResponse.getStatus());
		}
		String jsonRequest = clientResponse.getEntity(String.class);

		return jsonRequest;
	}

	protected WebResource.Builder setHttpHeaders(WebResource res) {
		WebResource.Builder result = res.getRequestBuilder();
		for (Map.Entry<String, String> entry : headers.entrySet()) {
			result.header(entry.getKey(), entry.getValue());
		}
		return result;
	}

	private boolean evalClientResponse(ClientResponse clientResponse) {
		boolean success = true;
		if (clientResponse.getStatus() >= 400 && clientResponse.getStatus() != 406) {
			String entity = clientResponse.getEntity(String.class);
			success = false;
		}
		return success;
	}

	private String getApiKey() throws Exception {
		if (null == APIKEY) {
			String uri = PROJECT_URI + "/@authentication";
			try {
				APIKEY = getAPIKey(uri, lacUser, lacPassword);
				if (null == APIKEY) {
					throw new Exception("APIKey is null");
				}
			}
			catch (Exception ex) {
				System.err.println("ERROR: Unable to logon as LAC as User " + lacUser);
				System.err.println("Please check your parameters - unable to logon to URL " + uri + " using lacUser: " + lacUser + " lacPassword: " + lacPassword);
				System.exit(-1);
			}
		}
		return APIKEY;
	}

	protected JSONArray asJsonOArrayt(String obj) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONArray)parser.parse(obj);
	}

	private JSONObject asJsonObject(String obj) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONObject)parser.parse(obj);
	}

	public String getBASE_HOST_FRAGMENT() {
		return BASE_HOST_FRAGMENT;
	}

	public void setBASE_HOST_FRAGMENT(String uri) {
		BASE_HOST_FRAGMENT = uri;
	}

	private static void printExportMessage(String message) {
		exportSB.append(message);
		exportSB.append("\n");
	}
}
