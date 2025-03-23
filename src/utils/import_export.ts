import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

import { getEntries, saveEntries } from "./filesystemService";

export const exportEntries = async () => {
	const entries = await getEntries();
	const json = JSON.stringify(entries, null, 2);

	if (Capacitor.getPlatform() === "web") {
		// Web: download
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
		// Mobile: Share
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
