import { createSlice, nanoid,  } from "@reduxjs/toolkit";

type Todo = { id: string; text: string };

type TodoState = {
  todos: Todo[];
};

const initialState: TodoState = {
  todos: [{ id: nanoid(), text: "Hello world" }],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({ id: nanoid(), text: action.payload });
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
