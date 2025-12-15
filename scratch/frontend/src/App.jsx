import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(data);
      throw new Error();
    } catch (error) {
      setError("root", { message: "This is incorrect" });
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            type="text"
            placeholder="Email"
            className="w-full border rounded-lg p-2"
          />
          {errors.email && (
            <div className="text-red-400">{errors.email.message}</div>
          )}

          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-2"
          />
          {errors.password && (
            <div className="text-red-400">{errors.password.message}</div>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-red-200 rounded-2xl w-1/2 mx-auto block hover:bg-blue-400 p-2 text-white"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
          {errors.root && (
            <div className="text-red-400">{errors.root.message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
