"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL!;

// ── 타입 정의 ──
export interface Todo {
  id: number;
  title: string;
  done: boolean;
  target_date?: string | null;
}

// ── 조회 ──

export async function getTodos(startDate?: string, endDate?: string): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  
  const res = await fetch(`${BACKEND_URL}/todos${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Todo 목록을 불러오는데 실패했습니다.");
  return res.json();
}

export async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Todo를 불러오는데 실패했습니다.");
  const todos: Todo[] = await res.json();
  const todo = todos.find((t) => t.id === id);
  if (!todo) throw new Error("해당 Todo를 찾을 수 없습니다.");
  return todo;
}

// ── 생성 ──

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const target_date = formData.get("target_date") as string;
  if (!title?.trim()) throw new Error("제목을 입력해주세요.");

  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      title: title.trim(),
      target_date: target_date || null
    }),
  });
  if (!res.ok) throw new Error("Todo 생성에 실패했습니다.");

  revalidatePath("/todos");
  redirect("/todos");
}

// ── 수정 ──

export async function updateTodo(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const done = formData.get("done") === "on";
  const target_date = formData.get("target_date") as string;

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      title: title?.trim(), 
      done,
      target_date: target_date || null
    }),
  });
  if (!res.ok) throw new Error("Todo 수정에 실패했습니다.");

  revalidatePath("/todos");
  redirect("/todos");
}

// ── 삭제 ──

export async function deleteTodo(id: number) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Todo 삭제에 실패했습니다.");

  revalidatePath("/todos");
}

// ── 토글 ──

export async function toggleTodo(id: number, currentDone: boolean) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !currentDone }),
  });
  if (!res.ok) throw new Error("Todo 상태 변경에 실패했습니다.");

  revalidatePath("/todos");
}
