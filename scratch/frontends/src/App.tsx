// import { Button } from "./components/ui/button";
// import React from "react";
import {BrowserRouter,Routes,Route } from "react-router-dom";
// import { Login } from "./Pages/Login";
// import AddTodo from "./components/AddTodo";
// import { Todos } from "./components/Todos";
import ProctorCamera from "./Pages/ProctorCamera";

import {Form2} from "./Form2";
import {Home} from "./Pages/Home";
const App = () => {
  return (
    <div className="min-h-screen max-w-5xl mx-auto p-5 ">
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Tracker" element={<ProctorCamera/>}/>
        </Routes>
      </BrowserRouter>
{/*      
        <Login />
      <AddTodo/>
      <Todos/> */}
      
 
  {/* <Form2/> */}
      {/* <Button>Submit</Button> */}
    </div>
  );
};
export default App;
