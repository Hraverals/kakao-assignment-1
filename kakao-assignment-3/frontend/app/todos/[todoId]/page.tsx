import { getTodo } from "../../actions";
import EditTodoForm from "./EditTodoForm";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodo(Number(todoId));

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans text-gray-800 py-12 px-4">
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          🔧 Todo 수정
        </h2>
        <EditTodoForm todo={todo} />
      </div>
    </div>
  );
}
