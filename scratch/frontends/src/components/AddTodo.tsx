import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store"; // import your typed dispatch
import { addTodo } from "../features/todo/todoSlice";

function AddTodo() {
  const [input, setInput] = useState("");

  // Use typed dispatch
  const dispatch = useDispatch<AppDispatch>();

  function addTodoHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim() === "") return;

    dispatch(addTodo(input)); // Type-safe dispatch
    setInput("");
  }

  return (
    <form onSubmit={addTodoHandler}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter todo"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodo;
