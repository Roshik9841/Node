import { Button } from "./components/ui/button";
import React from "react";
import { ThemeProvider } from "./components/theme-provider"
 import { ModeToggle } from "./components/mode-toggle";
import {Login } from "./Pages/Login"

 const App = ()=>{
   return(
 
    <div className="min-h-screen max-w-5xl mx-auto p-5 ">
 <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <ModeToggle/>
         <Login/>
    </ThemeProvider>
 

    {/* <Button>Submit</Button> */}
    </div>
   
   ) 
}
export default App;