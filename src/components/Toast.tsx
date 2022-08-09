import {FunctionalComponent} from 'preact';
import {StateUpdater} from 'preact/hooks';

export const Toast: FunctionalComponent<{
	setToastMessage: StateUpdater<string>;
	toastMessage: string;
}> = ({setToastMessage, toastMessage}) => {
	return (
		<div
			id="toast"
			onClick={() => setToastMessage('')}
			style="display: {message ? 'flex' : 'none'}"
		>
			<span>{toastMessage}</span>
		</div>
	);
};
