// import { Button } from "./components/ui/button";
// import React from "react";

import { Login } from "./Pages/Login";
import AddTodo from "./components/AddTodo";
import { Todos } from "./components/Todos";
import ProctorCamera from "./Pages/ProctorCamera";
import ProctorFocusTracker from "./Pages/ProctorFocusTracker";
import ProctorScreenShare from "./Pages/ProctorScreenShare";
import Form from "./Form";

const App = () => {
  return (
    <div className="min-h-screen max-w-5xl mx-auto p-5 ">
{/*      
        <Login />
      <AddTodo/>
      <Todos/> */}
      {/* <ProctorCamera/>
      <ProctorFocusTracker/>
      <ProctorScreenShare/> */}
  <Form/>
      {/* <Button>Submit</Button> */}
    </div>
  );
};
export default App;
