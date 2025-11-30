import { useEffect } from 'react'
import axios from 'axios';
import './App.css'
import {Form} from './components/Form.jsx';
function App() {
// const[data,setData] = useState([]);
//   useEffect(()=>{
//     const fetch = async()=>{
//       const res = await axios.get("http://localhost:5000/api/contacts");
//       setData(res.data);
//     }
//     fetch();
//   })
  return (
    <>
    <Form/>

    {/* {data.map((contact)=>(
      contact.data;
    ))} */}
      
    </>
  )
}

export default App
