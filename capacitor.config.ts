import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.company.journalapp",
	appName: "JournalApp",
	webDir: "dist",
	server: {
		androidScheme: "https",
	},
	plugins: {},
};

export default config;
