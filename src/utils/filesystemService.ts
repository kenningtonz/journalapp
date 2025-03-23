import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

const JOURNAL_FILE = "journal_entries.json";
import { v4 as uuidv4 } from "uuid";

export const addEntry = async (title: string, content: string) => {
	const entries = await getEntries();
	const newEntry = {
		id: uuidv4(),
		title,
		content,
		timestamp: new Date().toISOString(),
	};
	entries.unshift(newEntry);
	await saveEntries(entries);
};

export const updateEntry = async (
	id: string,
	updatedData: { title: string; content: string }
) => {
	const entries = await getEntries();
	const updatedEntries = entries.map((entry) =>
		entry.id === id ? { ...entry, ...updatedData } : entry
	);
	await saveEntries(updatedEntries);
};

export const deleteEntry = async (id: string) => {
	const entries = await getEntries();
	const filtered = entries.filter((e) => e.id !== id);
	await saveEntries(filtered);
};

export const saveEntries = async (entries: any[]) => {
	await Filesystem.writeFile({
		path: JOURNAL_FILE,
		data: JSON.stringify(entries),
		directory: Directory.Data,
		encoding: Encoding.UTF8,
	});
};

export const getEntries = async (): Promise<any[]> => {
	try {
		const result = await Filesystem.readFile({
			path: JOURNAL_FILE,
			directory: Directory.Data,
			encoding: Encoding.UTF8,
		});
		return JSON.parse(result.data as string);
	} catch (err) {
		// File may not exist yet
		return [];
	}
};

export const exportEntries = async () => {
	const entries = await getEntries();
	const json = JSON.stringify(entries, null, 2); // Pretty print JSON

	if (Capacitor.getPlatform() === "web") {
		// 🟢 Web: Trigger download
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "journal_entries.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} else {
		// 🟢 Mobile: Use Share API
		await Share.share({
			title: "Export Journal Entries",
			text: "Here are my journal entries:",
			url: "data:application/json;base64," + btoa(json),
			dialogTitle: "Share your journal entries",
		});
	}
};

export const importEntries = async (): Promise<boolean> => {
	try {
		if (Capacitor.getPlatform() === "web") {
			// Web: File picker
			return new Promise((resolve) => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = "application/json";
				input.onchange = async (e: any) => {
					const file = e.target.files[0];
					const text = await file.text();
					const imported = JSON.parse(text);
					await saveEntries(imported);
					resolve(true);
				};
				input.click();
			});
		} else {
			// Mobile: Not built-in - would need Capacitor FilePicker plugin or custom integration
			alert("Import is currently supported on Web only.");
			return false;
		}
	} catch (err) {
		console.error("Import failed:", err);
		return false;
	}
};
