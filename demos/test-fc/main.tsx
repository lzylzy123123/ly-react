import { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = function () {
	const [num, setNum] = useState(5000);
	return <div onClick={() => setNum(num+1)}>{num}</div>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
