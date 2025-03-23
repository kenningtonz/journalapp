import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonTextarea,
	IonGrid,
} from "@ionic/react";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";

import "./Tab1.css";

const Tab1: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Tab 1</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse='condense'>
					<IonToolbar>
						<IonTitle size='large'>Tab 1</IonTitle>
					</IonToolbar>
				</IonHeader>
				<EntryForm />
			</IonContent>
		</IonPage>
	);
};

export default Tab1;
