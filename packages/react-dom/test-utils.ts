import { ReactElementType } from 'shared/reactTypes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import { createRoot } from 'react-dom';

export function renderIntoDocument(element: ReactElementType) {
	const div = document.createElement('div');
  return createRoot(div).render(element);
}
