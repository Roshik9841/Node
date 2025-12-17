// import { Button } from "./components/ui/button";
// import React from "react";

// import { Login } from "./Pages/Login";
import AddTodo from "./components/AddTodo";
import { Todos } from "./components/Todos";

const App = () => {
  return (
    <div className="min-h-screen max-w-5xl mx-auto p-5 ">
     
        {/* <Login /> */}
      <AddTodo/>
      <Todos/>

      {/* <Button>Submit</Button> */}
    </div>
  );
};
export default App;
