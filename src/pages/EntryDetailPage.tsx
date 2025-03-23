import React, { useEffect, useState } from "react";
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonItem,
	IonLabel,
	IonInput,
	IonTextarea,
	IonButton,
	useIonRouter,
} from "@ionic/react";
import {
	getEntries,
	updateEntry,
	deleteEntry,
} from "../utils/filesystemService";
import { useParams } from "react-router";

const EntryDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const router = useIonRouter();
	const [entry, setEntry] = useState<any>(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		const load = async () => {
			const entries = await getEntries();
			const found = entries.find((e) => e.id === id);
			if (found) {
				setEntry(found);
				setTitle(found.title);
				setContent(found.content);
			}
		};
		load();
	}, [id]);

	const handleUpdate = async () => {
		await updateEntry(id, { title, content });
		router.goBack();
	};

	const handleDelete = async () => {
		await deleteEntry(id);
		router.push("/");
	};

	if (!entry) return null;

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Edit Entry</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				<IonItem>
					<IonLabel position='stacked'>Title</IonLabel>
					<IonInput
						value={title}
						onIonChange={(e) => setTitle(e.detail.value!)}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position='stacked'>Content</IonLabel>
					<IonTextarea
						value={content}
						onIonChange={(e) => setContent(e.detail.value!)}
					/>
				</IonItem>
				<IonButton
					expand='block'
					className='ion-margin-top'
					onClick={handleUpdate}
				>
					Save Changes
				</IonButton>
				<IonButton
					expand='block'
					color='danger'
					className='ion-margin-top'
					onClick={handleDelete}
				>
					Delete Entry
				</IonButton>
			</IonContent>
		</IonPage>
	);
};

export default EntryDetailPage;
