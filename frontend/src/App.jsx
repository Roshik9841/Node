import { useEffect,useState } from 'react'
import axios from 'axios';
import './App.css'
import {Form} from './components/Form.jsx';
function App() {
const[data,setData] = useState([]);

const fetchData = async()=>{
      const res = await axios.get("http://localhost:5000/api/data/");
      setData(res.data);
    }             

  useEffect(()=>{
    
    fetchData();
  },[])
  function handleDelete(id){
    axios.delete(`http://localhost:5000/api/data/${id}`);
    setData(prev => prev.filter(item => item._id !== id));
  }
  return (
    <>
    <Form onSuccess={fetchData}/>

    {data.map((item)=>(
      <div className="max-w-xl mx-auto p-4 m-5 border-b-2 border-gray-300 grid grid-cols-3">

      
      <ul className=" ">
        <li key={item._id} >{item.name}</li>
        <li key={item._id} >{item.age}</li>
        <li key={item._id} >{item.address}</li>
       
      </ul>
       <button type="submit">edit</button>
       <button type="submit" onClick={()=>handleDelete(item._id)} className="bg-red-600 border-3 rounded-3xl cursor-pointer">delete</button>
      </div>
    ))
    }
      
    </>
  )
}

export default App
