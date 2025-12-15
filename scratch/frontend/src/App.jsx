import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";

// Zod schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function App() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "Roshik9841@gmail.com",
    },
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(data);

      // Simulate server-side error
      throw new Error();
    } catch (error) {
      setError("root", { message: "This is incorrect" });
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            className="w-full border rounded-lg p-2"
          />
          {errors.email && (
            <div className="text-red-400">{errors.email.message}</div>
          )}

          {/* Password */}
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-2"
          />
          {errors.password && (
            <div className="text-red-400">{errors.password.message}</div>
          )}

          {/* Submit button */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-red-200 rounded-2xl w-1/2 mx-auto block hover:bg-blue-400 p-2 text-white"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>

          {/* Server error */}
          {errors.root && (
            <div className="text-red-400 text-center mt-2">
              {errors.root.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
