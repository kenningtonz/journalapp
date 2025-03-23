import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { v4 as uuidv4 } from "uuid";

const JOURNAL_FILE = "journal_entries.json";

export const getEntries = async (): Promise<any[]> => {
	try {
		const result = await Filesystem.readFile({
			path: JOURNAL_FILE,
			directory: Directory.Data,
			encoding: Encoding.UTF8,
		});
		return JSON.parse(result.data as string);
	} catch (err) {
		return [];
	}
};

export const saveEntries = async (entries: any[]) => {
	await Filesystem.writeFile({
		path: JOURNAL_FILE,
		data: JSON.stringify(entries),
		directory: Directory.Data,
		encoding: Encoding.UTF8,
	});
};

export const addEntry = async (
	title: string,
	content: string,
	entryType: string
) => {
	const entries = await getEntries();
	const newEntry = {
		id: uuidv4(),
		title,
		content,
		entryType,
		timestamp: new Date().toISOString(),
		analysis: {
			summary: "",
			mood: "",
			advice: "",
		},
	};
	entries.unshift(newEntry);
	await saveEntries(entries);
};

export const updateEntry = async (id: string, updatedData: Partial<any>) => {
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

export const getAnalysisSetting = async (): Promise<boolean> => {
	const result = await Preferences.get({ key: "analysisEnabled" });
	return result.value === "true";
};

export const setAnalysisSetting = async (value: boolean) => {
	await Preferences.set({ key: "analysisEnabled", value: value.toString() });
};
