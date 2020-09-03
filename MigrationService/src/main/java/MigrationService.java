import java.io.File;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class MigrationService {

	protected Map<String, String> headers = new HashMap<>();

	private static final String AUTHENTICATION = "@authentication";
	public String BASE_URI_LOCATION = "http://localhost:8080/rest/default/demo/v1/";
	public static String PROJECT = "demo";
	protected static String OPTIONS = "";
	private static String osName;
	protected static String APIKEY = null;
	private static String adminUser = "sa";
	private static String lacUser = "admin";
	private static String lacPassword = "Password1";
	private static String adminPassword = "Password1";
	private static boolean firstTeamspace = true;
	private static String hostNameAndPort = "http://localhost:8080";
	protected String ALLOWED_METHODS_ALL = "GET, POST, PUT, DELETE, OPTIONS";
	protected String ALLOWED_METHODS_GET = "GET, OPTIONS";
	protected String ALLOWED_METHODS = ALLOWED_METHODS_ALL;
	public static String BASE_HOST_FRAGMENT = "http://localhost:8080/rest/abl/admin/v2/";
	private static String OS_COMMAND = "lacadmin";
	private static String COMMENT_LINE = "# ";
	private static String account_ident;
	private static StringBuilder exportSB = new StringBuilder();
	private static String fileExtension = ".sh";
	private static String filePathSeparator = File.separator;
	private static String fileLineBreak = "\n";
	private static String masterDirectoryName = "workspace" + filePathSeparator;

	public MigrationService() {
		headers.put("Content-Type", "application/json");
		headers.put("Accept", "application/json");
	}

	public static void main(String[] args) {
		if (args.length > 0 && args.length != 5) {
			printExportMessage("MigrationService usage:");
			printExportMessage(" arg1 = hostName and Port (http://localhost:8080)");
			printExportMessage(" arg2 = adminUser (default: sa)");
			printExportMessage(" arg3 = admin password(default: Password1) ");
			printExportMessage(" arg4 = TeamSpace username(default: admin) ");
			printExportMessage(" arg5 = TeamSpace password (default: Password1)");
			System.out.println(exportSB.toString());
			System.exit(1);
		}
		if (args.length == 5) {
			hostNameAndPort = args[0];        	//args1 = hostNameAndPort (http://localhost:8080)
			adminUser = args[1];            	//args2 = adminUser (sa)
			adminPassword = args[2];        	//args3 = admin password (Password1)
			lacUser = args[3];                	//arg4 = lacUser (admin)
			lacPassword = args[4];            	//arg5 = lacPassword (Password1)
			//arg6 = encrypted|plaintext (encrypted) NOT USED
			String sep = (hostNameAndPort.endsWith("/"))?"": "/";
			BASE_HOST_FRAGMENT = hostNameAndPort + sep + "rest/abl/admin/v2/";
		}

		setupOSEnvironment();
		MigrationService migrationService = new MigrationService();
		StringBuilder inportSB = new StringBuilder();
		addExportHeader(exportSB);
		addImportHeader(inportSB);
		printExportMessage(COMMENT_LINE + "OS: " + System.getProperty("os.name"));
		try {
			migrationService.getApiKey();
			List<String> accountIdents = migrationService.findAllTeamSpaces("admin:accounts?sysfilter=notequal(url_name:'abl')");
			for (String ident : accountIdents) {
				account_ident = ident;
				printExportMessage(COMMENT_LINE + "Start Export teamspace ident:" + account_ident);
				String version = migrationService.determineVersion("admin:server_properties?sysfilter=equal(ident:1)");
				System.out.println("Version " + version);
				migrationService.logonScript(inportSB);
				inportSB.append(COMMENT_LINE + "Start Import teamspace ident:" + account_ident + fileLineBreak);
				switch (version) {
					//deprecated
					//case "3.1":
					//case "3.2":
					//	migrationService.from31(inportSB);
					//	break;
					case "4.1":
					case "5.0":
					case "5.1":
					case "5.2":
					case "5.3":
					case "5.4":
					default:
						migrationService.from41(inportSB);
						break;
				}
				migrationService.logoutScript(inportSB);
				printExportMessage("");
				inportSB.append(fileLineBreak);
			}
		}
		catch (Exception e) {
			System.err.println(e.getMessage());
			e.printStackTrace();
			System.exit(-1);
		}
		//Print out all the scripts
		writeExportFile(exportSB.toString());
		writeImportFile(inportSB.toString());
		if (firstTeamspace) {
			System.out.println("MasterExport-1" + fileExtension + " and your MasterImport-2" + fileExtension + " scripts written to this directory");
		}
		else {
			System.out.println("MasterExport-1" + fileExtension + " and your MasterImport-2" + fileExtension + " scripts written to this directory");
			System.out.println("You have additional TeamSpace entries in your source system.");
			System.out.println("Remember to modify your MasterExport-1" + fileExtension + " and your MasterImport-2" + fileExtension + " scripts for [teamspaceUser] and [teamspacePassword]");
		}
	}

	private static void setupOSEnvironment() {
		osName = System.getProperty("os.name").toLowerCase();
		if (osName.contains("windows")) {
			OS_COMMAND = "windows\\lacadmin.exe";
			COMMENT_LINE = "REM ";
			fileExtension = ".cmd";
			fileLineBreak = "\r\n";
		}
		else if (osName.contains("mac")) {
			OS_COMMAND = "macos/lacadmin";
			COMMENT_LINE = "# ";
		}
		else if (osName.contains("linux")) {
			OS_COMMAND = "linux/lacadmin";
			COMMENT_LINE = "# ";
		}
	}

	private static void addExportHeader(final StringBuilder sb) {
		sb.append(COMMENT_LINE + "==============================================================="+fileLineBreak);
		sb.append(COMMENT_LINE + " EXPORT SCRIPT"+fileLineBreak);
		sb.append(COMMENT_LINE + " Please change script [teamspaceUser] and [teamspacePassword]"+fileLineBreak);
		sb.append(COMMENT_LINE + " if you have more than 1 TeamSpace in your source system"+fileLineBreak);
		sb.append(COMMENT_LINE + "==============================================================="+fileLineBreak);
		sb.append(""+fileLineBreak);
		if (osName.contains("windows")) {
			sb.append("if not exist \"workspace\" mkdir workspace"+fileLineBreak);
		}
		else {
			sb.append("mkdir -p workspace"+fileLineBreak);
		}
	}

	private static void addImportHeader(final StringBuilder sb) {
		sb.append(COMMENT_LINE + "================================================================"+fileLineBreak);
		sb.append(COMMENT_LINE + " IMPORT SCRIPT"+fileLineBreak);
		sb.append(COMMENT_LINE + " Please change script [teamspaceUser] and [teamspacePassword]"+fileLineBreak);
		sb.append(COMMENT_LINE + " if you have more than 1 TeamSpace in your source system"+fileLineBreak);
		sb.append(COMMENT_LINE + " "+fileLineBreak);
		sb.append(COMMENT_LINE + " Start your target server first"+fileLineBreak);
		sb.append(COMMENT_LINE + " and manually create each TeamSpace and user/password "+fileLineBreak);
		sb.append(COMMENT_LINE + "================================================================"+fileLineBreak);
	}

	private static void writeExportFile(final String str) {
		//System.out.println(str);
		writeFile("MasterExport-1" + fileExtension, str);
	}

	private static void writeImportFile(final String str) {
		//System.out.println(str);
		writeFile("MasterImport-2" + fileExtension, str);
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

	public void from41(StringBuilder sb) throws Exception {
		printExportMessage(COMMENT_LINE + OS_COMMAND + " teamspace exportRepos --file " + masterDirectoryName + "AllProjects" + account_ident + ".zip --format zip  --passwordstyle plaintext");
		accountLevelExtracts32(sb);
		sb.append(COMMENT_LINE + "Start import"+fileLineBreak);
		sb.append(COMMENT_LINE + OS_COMMAND + " api import --file " + masterDirectoryName + "AllProjects" + account_ident + ".zip --namecollision replace_existing"+fileLineBreak);
		List<String> idents = listObjects(sb, "api", "api", "admin:projects?sysfilter=equal(account_ident:" + account_ident + ")");
		for (String map : idents) {
			String[] content = map.split(",");
			String ident = content[0];
			String urlname = content[1];
			sb.append(OS_COMMAND + " api use --url_name " + urlname + ""+fileLineBreak);
		}
	}

	public void from31(StringBuilder sb) throws Exception {
		accountLevelExtracts32(sb);

		List<String> idents = listObjects(sb, "PROJECT", "project", "admin:projects?sysfilter=equal(account_ident:" + account_ident + ")");
		for (String map : idents) {
			String[] content = map.split(",");
			String ident = content[0];
			String urlname = content[1];
			sb.append(OS_COMMAND + " project use --url_name " + urlname + ""+fileLineBreak);
		}
	}

	private void accountLevelExtracts(final StringBuilder sb) throws Exception {
		accountLevelExtracts32(sb);
		listObjects(sb, "TEAMSPACE_USER", "teamspace_users", "admin:account_users?sysfilter=equal(account_ident:" + account_ident + ")");
	}

	private void accountLevelExtracts32(final StringBuilder sb) throws Exception {
		listObjects(sb, "AUTHPROVIDER", "authprovider", "admin:authproviders?sysfilter=equal(account_ident:" + account_ident + ")&sysfilter=greater(ident:1000)");
		//removed in 5.4 listObjects(sb, "MANAGEDSERVER", "managedserver", "admin:managed_data_servers?sysfilter=equal(account_ident:" + account_ident + ")");
		listObjects(sb, "GATEWAY", "gateway", "admin:gateways?sysfilter=equal(account_ident:" + account_ident + ")");
	}

	private List<String> listObjects(StringBuilder importSB, String prefix, String command, String endpointName) throws Exception {
		List<String> idents = new ArrayList<>();
		String endpoint = BASE_HOST_FRAGMENT + endpointName;
		// bug fix - avoid pagination if more then default object size
		String jsonString = restGet(endpoint, 1000,0, APIKEY);
		JSONArray array = asJsonOArray(jsonString);
		if (null != array && array.size() > 0) {
			//printExportMessage("#Start Export " + prefix);
		}
		for (int i = 0; i < array.size(); i++) {
			Object name = ((JSONObject)array.get(i)).get("name");
			Object ident = ((JSONObject)array.get(i)).get("ident");
			Object urlname = ((JSONObject)array.get(i)).get("url_name");
			if (StringUtils.isEmpty((String) name) || ((String)name).startsWith("Built-in")) {
				continue;
			}
			if (command.equalsIgnoreCase("project")) {
				printExportMessage(OS_COMMAND + " project export --url_name " + urlname + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json");
			}
			else {
				if (command.equals("api")) {
					printExportMessage(OS_COMMAND + " api export --url_name " + urlname + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json --passwordstyle plaintext --format json");
				}
				else {
					printExportMessage(OS_COMMAND + " " + command + " export --ident " + ident + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json ");
				}
			}
			if (null != importSB) {
				if (command.equals("project")) {
					importSB.append(OS_COMMAND + " api import " + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json"+fileLineBreak);
					importSB.append(OS_COMMAND + " api use --url_name " + urlname + " "+fileLineBreak);
					findDatasourcePasswords(importSB, "DATASOURCE", "datasource", "admin:dbaseschemas?sysfilter=equal(project_ident:" + ident + ")");
					findLibraries(importSB, "admin:project_libraries?sysfilter=equal(project_ident:" + ident + ")");
				}
				else if (command.equals("api")) {
					importSB.append(OS_COMMAND + " api import " + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json --namecollision replace_existing"+fileLineBreak);
					//importSB.append(OS_COMMAND+" api use --url_name " + urlname + " "+fileLineBreak);
					//findDatasourcePasswords(importSB, "DATASOURCE", "datasource", "admin:dbaseschemas?sysfilter=equal(project_ident:" + ident + ")");
				}
				else if (command.equals("libraries")) {
					importSB.append(OS_COMMAND + " " + command + " import " + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json --linkProject "+fileLineBreak);
				}
				else {
					importSB.append(OS_COMMAND + " " + command + " import " + " --file " + masterDirectoryName + clean(prefix + "_" + name) + ".json"+fileLineBreak);
				}
			}
			idents.add(ident + "," + urlname);
		}
		return idents;
	}

	private List<String> findAllTeamSpaces(String endpointName) throws Exception {
		List<String> idents = new ArrayList<>();
		String jsonString = restGet(BASE_HOST_FRAGMENT + endpointName, APIKEY);
		JSONArray array = asJsonOArray(jsonString);
		if (null != array && array.size() == 0) {
			return idents;
		}
		for (int i = 0; i < array.size(); i++) {
			Object ident = ((JSONObject)array.get(i)).get("ident");
			Object name = ((JSONObject)array.get(i)).get("name");
			Object urlname = ((JSONObject)array.get(i)).get("url_name");
			printExportMessage(COMMENT_LINE + "Found Teamspace name: " + name + " url_name: " + urlname + " ident: " + ident);
			idents.add(ident.toString());
		}
		printExportMessage(COMMENT_LINE + "");
		return idents;
	}

	private void findLibraries(StringBuilder importSB, String endpointName) throws Exception {
		String jsonString = restGet(BASE_HOST_FRAGMENT + endpointName, APIKEY);
		JSONArray array = asJsonOArray(jsonString);
		if (null != array && array.size() == 0) {
			return;
		}
		for (int i = 0; i < array.size(); i++) {
			Object ident = ((JSONObject)array.get(i)).get("logic_library_ident");
			listObjects(importSB, "LIBRARY", "libraries", "admin:logic_libraries?sysfilter=equal(ident:" + ident + ")&sysfilter=greater(ident:999)");
		}
	}


	private void findDatasourcePasswords(StringBuilder importSB, String prefix, String command, String endpointName) throws Exception {
		String endpoint = BASE_HOST_FRAGMENT + endpointName;

		String jsonString = restGet(endpoint, APIKEY);
		JSONArray array = asJsonOArray(jsonString);
		if (null != array && array.size() == 0) {
			return;
		}
		for (int i = 0; i < array.size(); i++) {
			Object name = ((JSONObject)array.get(i)).get("name");
			Object pw = ((JSONObject)array.get(i)).get("password");
			if (null != pw) {
				Object prfx = ((JSONObject)array.get(i)).get("prefix");
				Object salt = ((JSONObject)array.get(i)).get("salt");
				String password = decode(pw.toString(), salt);
				if (null != importSB) {
					importSB.append(OS_COMMAND + " datasource update " + " --password '" + password + "' --salt '" + salt + "' --prefix " + prfx + ""+fileLineBreak);
				}
			}
		}
	}

	private String decode(String encryptedPassword, Object salt) {
		//String decryptedPassword = com.kahuna.server.security.BlowfishDecrypter.decrypt(encryptedPassword, salt);
		return encryptedPassword;
	}

	private void logoutScript(StringBuilder sb) {
		sb.append(OS_COMMAND + " logout"+fileLineBreak);
	}

	private void logonScript(StringBuilder sb) {
		printExportMessage(OS_COMMAND + " logout");
		logoutScript(sb);
		if (firstTeamspace) {
			printExportMessage(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort);
			sb.append(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort + ""+fileLineBreak);
			if(osName.equals("linux")) {
				printExportMessage(COMMENT_LINE + " linux bug requires 2nd login");
				printExportMessage(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort);
				sb.append(COMMENT_LINE + "Linux bug requires 2nd login "+fileLineBreak);
				sb.append(OS_COMMAND + " login -u " + this.lacUser + " -p " + this.lacPassword + " " + this.hostNameAndPort + ""+fileLineBreak);
			}
			firstTeamspace = false;
		}
		else {
			printExportMessage(COMMENT_LINE + " *******    TODO CHANGE THE [teamspaceUser] and [teamspacePassword] below ******");
			printExportMessage(OS_COMMAND + " login -u [teamspaceUser] -p [teamspacePassword] " + this.hostNameAndPort);
			sb.append(COMMENT_LINE + " *******    TODO CHANGE THE [teamspaceUser] and [teamspacePassword] below ******"+fileLineBreak);
			sb.append(OS_COMMAND + " login -u [teamspaceUser] -p [teamspacePassword] " + this.hostNameAndPort + ""+fileLineBreak);
		}
	}

	private String determineVersion(String endpoint) throws Exception {
		String version = "3.1"; //3.2 is the same
		String currentAdminSchema = "20180501";
		String jsonString = restGet(BASE_HOST_FRAGMENT + endpoint, APIKEY);
		JSONArray array = asJsonOArray(jsonString);
		for (int i = 0; i < array.size(); i++) {
			Object prop_name = ((JSONObject)array.get(i)).get("prop_name");
			String prop_version = ((JSONObject)array.get(i)).get("prop_value").toString();
			if (prop_version.equals(currentAdminSchema)) {
				return "5.0";
			}
			else if ("20180226".equals(prop_version)) {
				return "4.1";
			}
		}
		return version;
	}

	private String clean(String name) {
		String result = name.replace(" ", "_");
		result = result.replace("(", "");
		result = result.replace(")", "");
		result = result.replace("/", "_");
		result = result.replace("$", "");
		result = result.replace("%", "");
		return result + "_" + account_ident;
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
		String join = "?";
		if(uri.contains("?")){
			join = "&";
		}
		return restGet(uri + join + "pagesize=" + pagesize + "&offset=" + offset + "&nometa=true", anApiKey);
	}

	public String restGet(String uri, String anApiKey) throws Exception {
		//HttpGet get = new HttpGet(uri);
		//get.setHeader("Authorization", "CALiveAPICreator " + anApiKey + ":1");
		//HttpResponse resp = client.execute(get);
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
			String uri = BASE_HOST_FRAGMENT + "@authentication";
			try {
				APIKEY = getAPIKey(uri, adminUser, adminPassword);
				if (null == APIKEY) {
					throw new Exception("APIKey is null");
				}
			}
			catch (Exception ex) {
				System.err.println("ERROR: Unable to logon as Admin User ");
				System.err.println("Please check your parameters - unable to logon to URL " + uri + " using adminUser: " + adminUser + " adminPassword: " + adminPassword);
				System.exit(-1);
			}
		}
		return APIKEY;
	}

	protected JSONArray asJsonOArray(String obj) throws ParseException {
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
		exportSB.append(""+fileLineBreak);
	}
}
