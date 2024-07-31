import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNum] = useState(100);
	return (
		<div>
			<span>{num}</span>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
