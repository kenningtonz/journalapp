import React, { useEffect, useState } from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonAlert,
	IonItem,
	IonLabel,
	IonToggle,
} from "@ionic/react";
import {
	getAnalysisSetting,
	setAnalysisSetting,
} from "../utils/filesystemService";
import { exportEntries, importEntries } from "../utils/import_export";
import { Preferences } from "@capacitor/preferences";

const SettingsPage: React.FC = () => {
	const [showSuccess, setShowSuccess] = useState(false);
	const [analysisEnabled, setAnalysisEnabled] = useState(true);

	useEffect(() => {
		const loadSettings = async () => {
			const enabled = await getAnalysisSetting();
			setAnalysisEnabled(enabled);
		};
		loadSettings();
	}, []);

	const handleImport = async () => {
		const success = await importEntries();
		if (success) setShowSuccess(true);
	};

	const toggleAnalysis = async (value: boolean) => {
		setAnalysisEnabled(value);
		await setAnalysisSetting(value);
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				<IonItem>
					<IonLabel>Enable AI Analysis</IonLabel>
					<IonToggle
						checked={analysisEnabled}
						onIonChange={(e) => toggleAnalysis(e.detail.checked)}
					/>
				</IonItem>
				<IonButton
					expand='block'
					onClick={exportEntries}
				>
					Export Entries
				</IonButton>
				<IonButton
					expand='block'
					onClick={handleImport}
					className='ion-margin-top'
				>
					Import Entries
				</IonButton>

				<IonAlert
					isOpen={showSuccess}
					onDidDismiss={() => setShowSuccess(false)}
					header='Import Successful'
					message='Your entries have been imported!'
					buttons={["OK"]}
				/>
			</IonContent>
		</IonPage>
	);
};

export default SettingsPage;
