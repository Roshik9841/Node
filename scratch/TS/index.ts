import axios from "axios";

type Todo = {
  userId: Number;
  id: Number;
  title: string;
  completed: boolean;
};
const fetch = async () => {
  const data = await axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos/1");

  const res = data.data;

  console.log(res);
};
fetch();
