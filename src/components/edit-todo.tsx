"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";

export function EditTodo({
  id,
  initialTitle,
  onClose,
}: {
  id: number;
  initialTitle: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const editMutation = trpc.todo.editTodo.useMutation();
  const utils = trpc.useContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    await editMutation.mutateAsync({ id, title });
    utils.todo.getTodos.invalidate();
    onClose();
    toast.success("Todo updated successfully");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-lg"
        placeholder="Edit todo"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Cancel
      </button>
    </form>
  );
}