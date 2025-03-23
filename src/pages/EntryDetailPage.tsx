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
	IonButtons,
	IonBackButton,
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

	// const reanalyze = async (mode: "summary" | "mood" | "advice") => {
	// 	const result = await analyzeEntry(entry.content, mode);
	// 	const updatedAnalysis = { ...entry.analysis, [mode]: result };
	// 	await updateEntry(entry.id, { analysis: updatedAnalysis });
	// 	setEntry({ ...entry, analysis: updatedAnalysis });
	// };

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
					<IonButtons slot='start'>
						<IonBackButton defaultHref='/' />
					</IonButtons>
					<IonTitle>Edit Entry - {entry.timestamp}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				<IonItem>
					<IonLabel position='stacked'>Title</IonLabel>
					<IonInput
						value={title}
						onIonChange={(e) => setTitle(e.detail.value!)}
						required
					/>
				</IonItem>
				<IonItem>
					<IonLabel position='stacked'>Content</IonLabel>
					<IonTextarea
						value={content}
						onIonChange={(e) => setContent(e.detail.value!)}
						required
					/>
				</IonItem>
				<IonItem>
					<IonLabel position='stacked'>AI Analysis</IonLabel>
					<p>{entry.analysis || "No analysis yet."}</p>
				</IonItem>
				<IonItem>
					<IonLabel position='stacked'>
						AI Analysis (Summary)
					</IonLabel>
					<p>{entry.analysis?.summary || "No analysis yet."}</p>
				</IonItem>
				<IonItem>
					<IonLabel position='stacked'>AI Mood Detection</IonLabel>
					<p>{entry.analysis?.mood || "No analysis yet."}</p>
				</IonItem>
				<IonItem>
					<IonLabel position='stacked'>AI Advice</IonLabel>
					<p>{entry.analysis?.advice || "No analysis yet."}</p>
				</IonItem>

				{/* <IonButton
					expand='block'
					className='ion-margin-top'
					onClick={() => reanalyze("summary")}
				>
					Re-analyze Summary
				</IonButton>
				<IonButton
					expand='block'
					className='ion-margin-top'
					onClick={() => reanalyze("mood")}
				>
					Re-analyze Mood
				</IonButton>
				<IonButton
					expand='block'
					className='ion-margin-top'
					onClick={() => reanalyze("advice")}
				>
					Re-analyze Advice
				</IonButton> */}

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
