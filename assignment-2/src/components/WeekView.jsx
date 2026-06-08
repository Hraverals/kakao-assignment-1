function WeekView({
    currentWeekStart,
    currentDate,
    todos,
    onPrevWeek,
    onNextWeek,
    onSelectDate,
    formatDateString,
}) {
    const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
    const todayStr = formatDateString(new Date());
    const selectedDateStr = formatDateString(currentDate);

    // 현재 보고 있는 주의 월요일 기준 연도/월 표시
    const displayYear = currentWeekStart.getFullYear();
    const displayMonth = currentWeekStart.getMonth() + 1;

    // 7일 배열 생성
    const days = dayNames.map((name, i) => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + i);
        const dateStr = formatDateString(d);
        const count = todos.filter((t) => t.date === dateStr).length;
        const isSelected = dateStr === selectedDateStr;
        const isToday = dateStr === todayStr;

        return { name, date: d, dateStr, count, isSelected, isToday };
    });

    return (
        <>
            {/* 주간 네비게이션 */}
            <div className="mb-5 flex items-center justify-between">
                <button
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg font-bold text-gray-500 transition-all duration-200 hover:bg-primary-light hover:text-primary"
                    onClick={onPrevWeek}
                >
                    &lt;
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                    {displayYear}년 {displayMonth}월
                </h2>
                <button
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-lg font-bold text-gray-500 transition-all duration-200 hover:bg-primary-light hover:text-primary"
                    onClick={onNextWeek}
                >
                    &gt;
                </button>
            </div>

            {/* 주간 뷰 */}
            <div className="mb-2 flex justify-between">
                {days.map((day) => {
                    const base =
                        "flex w-[13.5%] cursor-pointer flex-col items-center rounded-xl border px-1 py-2.5 transition-all duration-200";
                    const selectedStyle = day.isSelected
                        ? "bg-primary border-transparent"
                        : "border-transparent hover:bg-gray-100";
                    const todayStyle =
                        !day.isSelected && day.isToday ? "border-primary" : "";

                    return (
                        <div
                            key={day.dateStr}
                            className={`${base} ${selectedStyle} ${todayStyle}`}
                            onClick={() => onSelectDate(day.date)}
                        >
                            <span
                                className={`mb-1.5 text-[13px] ${
                                    day.isSelected
                                        ? "text-white/85"
                                        : "text-gray-500"
                                }`}
                            >
                                {day.name}
                            </span>
                            <span
                                className={`mb-1.5 text-base font-semibold ${
                                    day.isSelected
                                        ? "text-white"
                                        : day.isToday
                                          ? "font-extrabold text-primary"
                                          : "text-gray-800"
                                }`}
                            >
                                {day.date.getDate()}
                            </span>
                            <span
                                className={`min-w-[24px] rounded-[10px] px-2 py-0.5 text-center text-[11px] font-bold ${
                                    day.isSelected
                                        ? "bg-white/25 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {day.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default WeekView;
