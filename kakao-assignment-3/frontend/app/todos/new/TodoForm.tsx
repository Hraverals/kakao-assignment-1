"use client";

import { createTodo } from "../../actions";
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
      {pending ? "생성 중..." : "생성하기"}
    </button>
  );
}

interface TodoFormProps {
  defaultDate?: string;
}

export default function TodoForm({ defaultDate }: TodoFormProps) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const fallbackDate = today.toISOString().split("T")[0];

  return (
    <form action={createTodo} className="space-y-4">
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
          placeholder="할 일을 입력하세요..."
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
          defaultValue={defaultDate || fallbackDate}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base outline-none transition-colors duration-200 focus:border-primary"
        />
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
