"use client";

import { updateTodo } from "../../actions";
import type { Todo } from "../../actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 cursor-pointer rounded-lg border-none bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "수정 중..." : "수정하기"}
    </button>
  );
}

interface EditTodoFormProps {
  todo: Todo;
}

export default function EditTodoForm({ todo }: EditTodoFormProps) {
  const updateTodoWithId = updateTodo.bind(null, todo.id);

  return (
    <form action={updateTodoWithId} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-600 mb-1.5"
        >
          할 일
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={todo.title}
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base outline-none transition-colors duration-200 focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="target_date"
          className="block text-sm font-semibold text-gray-600 mb-1.5"
        >
          날짜 지정
        </label>
        <input
          id="target_date"
          name="target_date"
          type="date"
          defaultValue={
            todo.target_date || new Date().toISOString().split("T")[0]
          }
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base outline-none transition-colors duration-200 focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-3 py-1">
        <input
          id="done"
          name="done"
          type="checkbox"
          defaultChecked={todo.done}
          className="h-5 w-5 cursor-pointer rounded accent-primary"
        />
        <label
          htmlFor="done"
          className="cursor-pointer text-sm font-semibold text-gray-600"
        >
          완료 여부
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <SubmitButton />
        <Link
          href="/todos"
          className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-200"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
