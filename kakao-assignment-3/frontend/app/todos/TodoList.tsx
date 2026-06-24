"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTodo, toggleTodo } from "../actions";
import type { Todo } from "../actions";

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (todo: Todo) => {
    startTransition(async () => {
      await toggleTodo(todo.id, todo.done);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    startTransition(async () => {
      await deleteTodo(id);
    });
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        <p>등록된 Todo가 없습니다.</p>
      </div>
    );
  }

  return (
    <ul
      className={`m-0 list-none p-0 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex animate-slide-in items-center justify-between border-b border-gray-100 py-4 transition-all duration-300 last:border-b-0"
        >
          <span
            className={`flex-1 break-all pr-4 text-base transition-colors duration-300 ${
              todo.done ? "text-gray-400 line-through" : ""
            }`}
          >
            {todo.title}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleToggle(todo)}
              className={`cursor-pointer rounded-md border-none px-2.5 py-1.5 text-sm transition-all duration-200 ${
                todo.done
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-primary-light text-primary hover:bg-primary-light-hover"
              }`}
            >
              {todo.done ? "취소" : "완료"}
            </button>
            <button
              onClick={() => router.push(`/todos/${todo.id}`)}
              className="cursor-pointer rounded-md border-none bg-gray-100 px-2.5 py-1.5 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-200"
            >
              수정
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="cursor-pointer rounded-md border-none bg-danger-light px-2.5 py-1.5 text-sm text-danger transition-all duration-200 hover:bg-danger-light-hover"
            >
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
