import { IonTextarea, IonButton } from "@ionic/react";
import "./ExploreContainer.css";

interface ContainerProps {
	name: string;
}

const TextContainer: React.FC<ContainerProps> = ({ name }) => {
	return (
		<div className='container'>
			<strong>{name}</strong>

			<IonTextarea placeholder='Enter some text...'></IonTextarea>
			<IonButton>Submit</IonButton>
		</div>
	);
};

export default TextContainer;
