import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = function () {
	const [num, updateNum] = useState(0);
  useEffect(()=>{
    console.log('App mount');
  },[])

  useEffect(()=>{
    console.log('num change create',num);
    return ()=>{
      console.log('num change destroy',num);
    }
  },[num])
	
	return (
		<div onClick={()=>updateNum(num+1)}>
      {num===0?<Child/>:'noop'}
    </div>
	);
};

function Child(){
  useEffect(()=>{
    console.log('child mount');
    return ()=>console.log('child unmount');
  },[])

  return 'i am child'
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
