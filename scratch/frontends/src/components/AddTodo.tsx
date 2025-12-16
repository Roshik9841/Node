import React, { useState } from 'react';

import {useDispatch} from 'react-redux';
import {addTodo,removeTodo} from '../features/todo/todoSlice.js';

function AddTodo(){

    const [input,setInput] =useState("");
    const dispatch = useDispatch();

    function addTodoHandler(e:React.ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        dispatch(addTodo(input));
        setInput('');
    }

    return(
        <>
        <form onSubmit={addTodoHandler}>
            <input type="text"
            value={input}
            onChange= {(e)=>setInput(e.target.value)}
            placeholder="Enter"/>



        </form>
        </>
    )
}
export default AddTodo;