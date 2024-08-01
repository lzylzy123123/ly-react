import { useState } from 'react'
import ReactDOM from 'react-dom/client'

const App = function () {
  const [num] = useState(5000);
  return (
    <div>
      <span>{num}</span>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App/>
)
