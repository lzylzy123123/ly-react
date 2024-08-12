import ReactDOM from 'react-noop-renderer';

const App = function () {
	return (
		<>
			<Child />
			<div>hello</div>
		</>
	);
};

function Child() {
	return 'i am child';
}

const root = ReactDOM.createRoot();
root.render(<App />);
window.root = root;
