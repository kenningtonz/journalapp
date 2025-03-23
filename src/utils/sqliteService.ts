import {
	CapacitorSQLite,
	SQLiteConnection,
	SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

const sqlite = new SQLiteConnection(CapacitorSQLite);

let db: SQLiteDBConnection | null = null;

export const initDB = async () => {
	if (db) return db;
	try {
		if (Capacitor.getPlatform() === "web") {
			console.log("Initializing Web Store...");
			await sqlite.initWebStore();
		}

		const connection = await sqlite.createConnection(
			"journalDB",
			false,
			"no-encryption",
			1,
			false
		);
		console.log("Connection created");

		await connection.open();
		console.log("Database opened");

		await connection.execute(`
      CREATE TABLE IF NOT EXISTS entries (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);
		console.log("Table ensured");

		if (Capacitor.getPlatform() === "web") {
			await sqlite.saveToStore("journalDB");
		}

		db = connection;
		return db;
	} catch (err) {
		console.error("Error initializing DB:", err);
		throw err;
	}
};

export const saveEntry = async (
	id: string,
	title: string,
	content: string,
	timestamp: string
) => {
	if (!db) await initDB();
	if (!db) return;

	try {
		await db.run(
			`INSERT INTO entries (id, title, content, timestamp) VALUES (?, ?, ?, ?)`,
			[id, title, content, timestamp]
		);

		// Save to IndexedDB on Web
		if (Capacitor.getPlatform() === "web") {
			await sqlite.saveToStore("journalDB");
		}

		console.log("Entry saved!");
	} catch (err) {
		console.error("Error saving entry:", err);
	}
};

export const fetchEntries = async () => {
	if (!db) await initDB();
	if (!db) return [];

	try {
		const res = await db.query(
			`SELECT * FROM entries ORDER BY timestamp DESC;`
		);

		// Save to IndexedDB on Web (just in case)
		if (Capacitor.getPlatform() === "web") {
			await sqlite.saveToStore("journalDB");
		}

		return res.values ?? [];
	} catch (err) {
		console.error("Error fetching entries:", err);
		return [];
	}
};
