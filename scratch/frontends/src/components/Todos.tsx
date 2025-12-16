import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTodo } from "../features/todo/todoSlice";

type Todo = {
  id: number;
  text: string;
};

export const Todos = () => {
  const todos: Todo[] = useSelector((state: any) => state.todos); // replace `any` with your RootState type if available
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Todos</h3>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}{" "}
            <button onClick={() => dispatch(removeTodo(todo.id))}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
