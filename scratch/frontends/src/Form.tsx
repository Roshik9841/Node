// src/App.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface User {
  id?: number;
  name: string;
  email: string;
}

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
});

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export default function Form() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // ✅ useQuery (v5 OBJECT syntax)
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get<User[]>("/users");
      return res.data;
    },
  });

  // ✅ Add / Edit mutation (v5)
  const mutation = useMutation({
    mutationFn: (user: User) =>
      editingUser
        ? api.put(`/users/${editingUser.id}`, user)
        : api.post("/users", user),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setEditingUser(null);
    },
  });

  // ✅ Delete mutation (v5)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset(user);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users CRUD</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-2">
        <input
          {...register("name")}
          placeholder="Name"
          className="border p-2 w-full"
        />
        {errors.name && (
          <p className="text-red-500">{errors.name.message}</p>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          className="border p-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editingUser ? "Update" : "Add"}
        </button>

        {editingUser && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 ml-2"
            onClick={() => {
              reset();
              setEditingUser(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between mb-2 border p-2">
            <span>
              {user.name} ({user.email})
            </span>
            <div>
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-400 px-2 py-1 mr-2"
              >
                Edit
              </button>

              {user.id && (
                <button
                  onClick={() => deleteMutation.mutate(user.id)}
                  className="bg-red-500 px-2 py-1 text-white"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
