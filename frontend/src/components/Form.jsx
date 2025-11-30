import {useState,useEffect} from 'react';
import React from 'react';
export const Form = ()=>{

    const [form,setForm] = useState({name:"",age:"",address:""});
    const inputRef = React.useRef(null);

      useEffect(() => {
    inputRef.current.focus();     // Auto-focus name field
  }, []);

    function handleSubmit(e){
        e.preventDefault();
        console.log("Form submitted:", form);
    }

    function handleChange(field,value){
        setForm({...form, [field]:value} );
    }
        return(
            <div className="max-w-6xl mx-auto p-4 m-5">

                <form className="flex max-w-3xl mx-auto flex-col gap-7 bg-gray-200 p-5" onSubmit = {handleSubmit}>
                    <div>

                 
                        <h2 className="mb-2 font-semibold">   Name:</h2>
                        <input type="text"  ref= {inputRef} value={form.name}  className= "border w-1/2 focus:outline-none focus:ring px-4 py-2" onChange={(e)=>handleChange("name",e.target.value)}/>
                    </div>
                    <div>

                   
                     <h2 className="mb-2 font-semibold">  Age:</h2>
                    <input type="text"s value={form.age} className= "border w-1/2 px-4 py-2 " onChange={(e)=>handleChange("age",e.target.value)}/>
                     </div>
                     <div>

                   

                    <h2 className="mb-2 font-semibold"> Address: </h2>
                    <input type="text" value={form.address} className= "border w-1/2 px-4 py-2" onChange={(e)=>handleChange("address",e.target.value)}/>
                      </div>

                    <div className="">
                        <button type="submit" className="cursor-pointer border-2 px-3 py-2 bg-blue-200 rounded-2xl   ">Submit</button>
                    </div>
                </form>

            </div>
        );
}