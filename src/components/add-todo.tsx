"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";

export function AddTodo() {
  const [title, setTitle] = useState("");
  const addMutation = trpc.todo.addTodo.useMutation();
  const utils = trpc.useContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    await addMutation.mutateAsync({ title });
    setTitle("");
    utils.todo.getTodos.invalidate();
    toast.success("Todo added successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </form>
  );
}