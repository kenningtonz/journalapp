import React, { useState } from "react";
import {
	IonButton,
	IonInput,
	IonTextarea,
	IonItem,
	IonLabel,
	IonList,
	IonAlert,
} from "@ionic/react";

import { addEntry } from "../utils/filesystemService";

const JournalEntryForm: React.FC = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) {
			setShowAlert(true);
			return;
		}

		await addEntry(title, content);

		setTitle("");
		setContent("");
		setSuccessAlert(true);
	};

	return (
		<form onSubmit={handleSubmit}>
			<IonList>
				<IonItem>
					<IonLabel position='stacked'>Title</IonLabel>
					<IonInput
						value={title}
						onIonChange={(e) => setTitle(e.detail.value!)}
						placeholder='Entry Title'
						required
					/>
				</IonItem>

				<IonItem>
					<IonLabel position='stacked'>Content</IonLabel>
					<IonTextarea
						value={content}
						onIonChange={(e) => setContent(e.detail.value!)}
						placeholder='Write your thoughts...'
						autoGrow
						required
					/>
				</IonItem>

				<IonButton
					expand='block'
					type='submit'
					className='ion-margin-top'
				>
					Save Entry
				</IonButton>
			</IonList>

			<IonAlert
				isOpen={showAlert}
				onDidDismiss={() => setShowAlert(false)}
				header='Missing Fields'
				message='Please fill in both the title and content.'
				buttons={["OK"]}
			/>

			<IonAlert
				isOpen={successAlert}
				onDidDismiss={() => setSuccessAlert(false)}
				header='Entry Saved'
				message='Your journal entry has been saved!'
				buttons={["OK"]}
			/>
		</form>
	);
};

export default JournalEntryForm;
