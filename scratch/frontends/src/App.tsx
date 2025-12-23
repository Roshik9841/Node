// import { Button } from "./components/ui/button";
// import React from "react";
import {BrowserRouter,Routes,Route } from "react-router-dom";
import { Login } from "./Pages/Login";
import AddTodo from "./components/AddTodo";
import { Todos } from "./components/Todos";
import ProctorCamera from "./Pages/ProctorCamera";
import ProctorFocusTracker from "./Pages/ProctorFocusTracker";
import ProctorScreenShare from "./Pages/ProctorScreenShare";
import Form from "./Form";
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
      
 
  {/* <Form/> */}
      {/* <Button>Submit</Button> */}
    </div>
  );
};
export default App;
