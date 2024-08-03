import { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = function () {
	const [num, setNum] = useState(5000);
	window.setNum = setNum;
	return num === 3 ? <div>react</div> : <div>{num}</div>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
