"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { EditTodo } from "@/components/edit-todo";
import { ConfirmModal } from "@/components/confirm-modal";
import toast from "react-hot-toast";

export function TodoList() {
  const { data: todos, refetch } = trpc.todo.getTodos.useQuery();
  const toggleMutation = trpc.todo.toggleTodo.useMutation();
  const deleteMutation = trpc.todo.deleteTodo.useMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleToggle = async (id: number, completed: boolean) => {
    await toggleMutation.mutateAsync({ id, completed });
    refetch();
    toast.success("Todo status updated");
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
    refetch();
    setDeletingId(null);
    toast.success("Todo deleted successfully");
  };

  return (
    <div className="space-y-4">
      {todos?.map((todo) => (
        <div
          key={todo.id}
          className="flex flex-col p-4 bg-white shadow rounded-lg space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
        >
          {editingId === todo.id ? (
            <EditTodo
              id={todo.id}
              initialTitle={todo.title}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, !todo.completed)}
                  className="w-5 h-5"
                />
                <span
                  className={`text-lg ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditingId(todo.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
      />
    </div>
  );
}