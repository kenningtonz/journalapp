import React, { useState } from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
	IonAlert,
} from "@ionic/react";
import { exportEntries, importEntries } from "../utils/filesystemService";

const SettingsPage: React.FC = () => {
	const [showSuccess, setShowSuccess] = useState(false);

	const handleImport = async () => {
		const success = await importEntries();
		if (success) setShowSuccess(true);
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
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
