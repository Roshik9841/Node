import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";

// Zod schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Infer TypeScript type from schema
type Schema2 = z.infer<typeof schema>;

function Form() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Schema2>({
    resolver: zodResolver(schema),
  });

  // Type data as Schema2
  const onSubmit = async (data: Schema2) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      console.log(data);

      // Simulate server error
      throw new Error("Server error");
    } catch (error) {
      // TypeScript: specify root as key
      setError("root" as const, { message: "This is incorrect" });
    }
  };

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

export default Form;
