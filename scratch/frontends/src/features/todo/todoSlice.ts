import { createSlice, nanoid,  } from "@reduxjs/toolkit";

type Todo = { id: string; text: string };

type TodoState = {
  todos: Todo[];
};

const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action:PayLoadAction<string>) => {
      state.todos.push({ id: nanoid(), text: action.payload });  //action.payload === whatever input you put
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
