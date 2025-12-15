import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }
  return (
    <div className=" min-h-screen flex justify-center items-center  bg-gray-100">
      <div className=" w-full max-w-sm bg-white shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="  space-y-6">
          <input
            {...register("email", {
              required: "Email must be in @ and required",
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            type="text"
            placeholder="Email"
            className="w-full border rounded-lg"
         
          />
          {errors.email && <div className="text-red-300">{errors.email.message}</div>}
          <input
            {...register("password", { required: "Password is required", minLength: 6 })}
            type="password"
            placeholder="password"
            className="w-full border rounded-lg"
        
          />
          {errors.password && <div className="text-red-300">{errors.password.message}</div>}
          <button
            type="submit"
            className="bg-red-200 rounded-2xl w-1/2 hover:bg-blue-400 p-2 text-white"
          >
            {isSubmitting?"Submitting":"Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
