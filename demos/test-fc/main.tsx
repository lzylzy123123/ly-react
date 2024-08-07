import { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = function () {
	const [num, setNum] = useState(5000);

	const arr =
		num % 2 === 0
			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];
	return (
		<ul onClick={() => setNum(num + 1)}>
			<li>4</li>
			<li>5</li>
			{arr}
		</ul>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
