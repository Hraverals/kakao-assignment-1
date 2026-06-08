import { useState, useCallback, useEffect } from "react";
import "./index.css";
import WeekView from "./components/WeekView.jsx";
import TodoInput from "./components/TodoInput.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TodoList from "./components/TodoList.jsx";

// 로컬스토리지 키
const STORAGE_KEY = "minimal_todo_data";
const WEEK_START_KEY = "minimal_todo_week_start";

// 로컬스토리지에서 초기 데이터 불러오기
function loadTodos() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// 로컬스토리지에 데이터 저장
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 고유 ID 생성 함수
function generateId() {
    return Date.now().toString();
}

// 날짜 포맷 함수 (YYYY-MM-DD)
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// 특정 날짜가 속한 주의 월요일 구하기
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function App() {
    const [todos, setTodos] = useState(loadTodos);
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const saved = localStorage.getItem(WEEK_START_KEY);
        return saved ? new Date(saved) : getMonday(new Date());
    });
    const [currentFilter, setCurrentFilter] = useState("all");

    // todos 변경 시 자동으로 로컬스토리지에 저장
    useEffect(() => {
        saveTodos(todos);
    }, [todos]);

    // 주간 뷰 시작일 변경 시 자동으로 로컬스토리지에 저장
    useEffect(() => {
        localStorage.setItem(WEEK_START_KEY, currentWeekStart.toISOString());
    }, [currentWeekStart]);

    // Todo 추가
    const addTodo = useCallback(
        (text) => {
            const newTodo = {
                id: generateId(),
                text: text,
                isCompleted: false,
                date: formatDateString(currentDate),
            };
            setTodos((prev) => [...prev, newTodo]);
        },
        [currentDate],
    );

    // Todo 삭제
    const deleteTodo = useCallback((id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }, []);

    // Todo 완료 상태 토글
    const toggleCompleteTodo = useCallback((id) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, isCompleted: !todo.isCompleted }
                    : todo,
            ),
        );
    }, []);

    // Todo 수정 (인라인 수정)
    const editTodo = useCallback((id, newText) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, text: newText.trim() } : todo,
            ),
        );
    }, []);

    // 이전 주 이동
    const goToPrevWeek = useCallback(() => {
        setCurrentWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() - 7);
            return next;
        });
    }, []);

    // 다음 주 이동
    const goToNextWeek = useCallback(() => {
        setCurrentWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + 7);
            return next;
        });
    }, []);

    // 날짜 선택
    const selectDate = useCallback((date) => {
        setCurrentDate(date);
    }, []);

    // 선택된 날짜 기준 필터링
    const targetDateStr = formatDateString(currentDate);
    let filteredTodos = todos.filter((todo) => todo.date === targetDateStr);

    if (currentFilter === "active") {
        filteredTodos = filteredTodos.filter((todo) => !todo.isCompleted);
    } else if (currentFilter === "completed") {
        filteredTodos = filteredTodos.filter((todo) => todo.isCompleted);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans text-gray-800">
            <div className="w-full max-w-[480px] rounded-2xl bg-white p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <header className="mb-6">
                    <WeekView
                        currentWeekStart={currentWeekStart}
                        currentDate={currentDate}
                        todos={todos}
                        onPrevWeek={goToPrevWeek}
                        onNextWeek={goToNextWeek}
                        onSelectDate={selectDate}
                        formatDateString={formatDateString}
                    />
                </header>

                <TodoInput onAdd={addTodo} />

                <FilterTabs
                    currentFilter={currentFilter}
                    onFilterChange={setCurrentFilter}
                />

                <TodoList
                    todos={filteredTodos}
                    onToggleComplete={toggleCompleteTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                />
            </div>
        </div>
    );
}

export default App;
