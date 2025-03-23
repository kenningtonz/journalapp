import React, { useEffect, useState } from "react";
import {
	IonList,
	IonItem,
	IonLabel,
	IonNote,
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	useIonRouter,
} from "@ionic/react";
import { getEntries } from "../utils/filesystemService";

type Entry = {
	id: string;
	title: string;
	content: string;
	timestamp: string;
};

const EntriesList: React.FC = () => {
	const [entries, setEntries] = useState<Entry[]>([]);
	const router = useIonRouter();

	useEffect(() => {
		const loadEntries = async () => {
			const data = await getEntries();
			setEntries(data);
		};
		loadEntries();
	}, []);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Journal Entries</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				<IonList>
					{entries.map((entry) => (
						<IonItem
							key={entry.id}
							button
							onClick={() => router.push(`/entry/${entry.id}`)}
						>
							<IonLabel>
								<h2>{entry.title}</h2>
								<p>{entry.content.slice(0, 50)}...</p>
								<IonNote>
									{new Date(entry.timestamp).toLocaleString()}
								</IonNote>
							</IonLabel>
						</IonItem>
					))}
				</IonList>
				{entries.length === 0 && <p>No entries yet.</p>}
			</IonContent>
		</IonPage>
	);
};

export default EntriesList;
