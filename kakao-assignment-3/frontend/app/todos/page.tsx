import { getTodos } from "../actions";
import TodoList from "./TodoList";
import Link from "next/link";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  let dateParam = typeof params.date === "string" ? params.date : undefined;
  const filter = typeof params.filter === "string" ? params.filter : "all";

  if (!dateParam) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateParam = today.toISOString().split("T")[0];
  }

  // 선택한 날짜가 속한 주의 월요일 구하기
  const current = new Date(dateParam);
  const day = current.getDay();
  const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(current);
  weekStart.setDate(diffToMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startDate = weekStart.toISOString().split("T")[0];
  const endDate = weekEnd.toISOString().split("T")[0];

  // 주간 전체 데이터 (각 요일별 카운트용)
  const allWeekTodos = await getTodos(startDate, endDate);

  // 이전/다음 주 날짜
  const prevWeek = new Date(weekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const displayYear = weekStart.getFullYear();
  const displayMonth = weekStart.getMonth() + 1;

  // 7일 배열 생성
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const todayObj = new Date();
  todayObj.setMinutes(todayObj.getMinutes() - todayObj.getTimezoneOffset());
  const todayStr = todayObj.toISOString().split("T")[0];

  const days = dayNames.map((name, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const count = allWeekTodos.filter((t) => t.target_date === dateStr).length;
    const isSelected = dateStr === dateParam;
    const isToday = dateStr === todayStr;
    return { name, date: d, dateStr, count, isSelected, isToday };
  });

  // 선택된 날짜 기준 필터링
  let filteredTodos = allWeekTodos.filter((t) => t.target_date === dateParam);
  if (filter === "active") {
    filteredTodos = filteredTodos.filter((t) => !t.done);
  } else if (filter === "completed") {
    filteredTodos = filteredTodos.filter((t) => t.done);
  }

  const filters = [
    { key: "all", label: "전체" },
    { key: "active", label: "진행 중" },
    { key: "completed", label: "완료" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans text-gray-800 py-12 px-4">
      <div className="w-full max-w-[480px] rounded-2xl bg-white p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <header className="mb-6">
          {/* 주간 네비게이션 */}
          <div className="mb-5 flex items-center justify-between">
            <Link
              href={`?date=${prevWeek.toISOString().split("T")[0]}`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-gray-500 transition-all duration-200 hover:bg-primary-light hover:text-primary"
            >
              &lt;
            </Link>
            <h2 className="text-xl font-bold text-gray-900">
              {displayYear}년 {displayMonth}월
            </h2>
            <Link
              href={`?date=${nextWeek.toISOString().split("T")[0]}`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-gray-500 transition-all duration-200 hover:bg-primary-light hover:text-primary"
            >
              &gt;
            </Link>
          </div>

          {/* 주간 뷰 */}
          <div className="mb-2 flex justify-between">
            {days.map((d) => {
              const base =
                "flex w-[13.5%] flex-col items-center rounded-xl border px-1 py-2.5 transition-all duration-200";
              const selectedStyle = d.isSelected
                ? "bg-primary border-transparent"
                : "border-transparent hover:bg-gray-100";
              const todayStyle =
                !d.isSelected && d.isToday ? "border-primary" : "";

              return (
                <Link
                  key={d.dateStr}
                  href={`?date=${d.dateStr}`}
                  className={`${base} ${selectedStyle} ${todayStyle}`}
                >
                  <span
                    className={`mb-1.5 text-[13px] ${
                      d.isSelected ? "text-white/85" : "text-gray-500"
                    }`}
                  >
                    {d.name}
                  </span>
                  <span
                    className={`mb-1.5 text-base font-semibold ${
                      d.isSelected
                        ? "text-white"
                        : d.isToday
                          ? "font-extrabold text-primary"
                          : "text-gray-800"
                    }`}
                  >
                    {d.date.getDate()}
                  </span>
                  <span
                    className={`min-w-[24px] rounded-[10px] px-2 py-0.5 text-center text-[11px] font-bold ${
                      d.isSelected
                        ? "bg-white/25 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {d.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </header>

        {/* 추가 버튼 (TodoInput 영역) */}
        <div className="mb-2 flex gap-2.5">
          <Link
            href={`/todos/new?date=${dateParam}`}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-base text-gray-400 transition-colors duration-200 hover:border-primary"
          >
            선택된 날짜의 할 일을 입력하세요...
          </Link>
          <Link
            href={`/todos/new?date=${dateParam}`}
            className="rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
          >
            추가
          </Link>
        </div>

        {/* 필터 탭 */}
        <div className="mt-2.5 mb-5 flex gap-2 border-b border-gray-200 pb-4">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={`?date=${dateParam}&filter=${f.key}`}
              className={`rounded-[20px] px-4 py-2 text-sm transition-all duration-200 ${
                filter === f.key
                  ? "bg-primary font-semibold text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* 할 일 목록 */}
        <TodoList todos={filteredTodos} />
      </div>
    </div>
  );
}
