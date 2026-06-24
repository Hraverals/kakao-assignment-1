import TodoForm from "./TodoForm";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const date = typeof params.date === "string" ? params.date : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans text-gray-800 py-12 px-4">
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          ✏️ 새 Todo 만들기
        </h2>
        <TodoForm defaultDate={date} />
      </div>
    </div>
  );
}
