// 상태 관리를 위한 변수 (로컬스토리지에서 초기 데이터 불러오기)
const STORAGE_KEY = "minimal_todo_data";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = "all"; // 'all', 'active', 'completed'
let currentDate = new Date(); // 현재 선택된 날짜

// DOM 요소 선택
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const errorMessage = document.getElementById("error-message");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const prevWeekBtn = document.getElementById("prev-week-btn");
const nextWeekBtn = document.getElementById("next-week-btn");
const currentMonthDisplay = document.getElementById("current-month-display");
const weekView = document.getElementById("week-view");

// 특정 날짜가 속한 주의 월요일 구하기
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    // 일요일(0)이면 -6일, 그 외에는 1에서 요일을 뺀 만큼(월요일 기준)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

let currentWeekStart = getMonday(new Date());

// 로컬스토리지에 데이터 저장
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 고유 ID 생성 함수
function generateId() {
    return Date.now().toString();
}

// 날짜 포맷 함수 (데이터 저장 및 비교용: YYYY-MM-DD)
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// 주간 뷰 그리기 함수
function renderWeekView() {
    weekView.innerHTML = "";
    const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
    const todayStr = formatDateString(new Date()); // 실제 오늘 날짜

    // 현재 보고 있는 주의 월요일 기준 연도/월 표시
    const displayYear = currentWeekStart.getFullYear();
    const displayMonth = currentWeekStart.getMonth() + 1;
    currentMonthDisplay.textContent = `${displayYear}년 ${displayMonth}월`;

    for (let i = 0; i < 7; i++) {
        // 해당 요일의 날짜 계산
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + i);

        const dateStr = formatDateString(d);
        // 해당 날짜에 있는 Todo 개수 계산
        const count = todos.filter((t) => t.date === dateStr).length;

        const isSelected = dateStr === formatDateString(currentDate);
        const isToday = dateStr === todayStr;

        // 요일 아이템 컨테이너 생성
        const dayDiv = document.createElement("div");
        dayDiv.className = `day-item ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`;
        dayDiv.onclick = () => {
            currentDate = d;
            renderWeekView(); // 뷰 업데이트 (선택 상태 변경)
            renderTodos(); // 하단 Todo 목록 업데이트
        };

        const nameSpan = document.createElement("span");
        nameSpan.className = "day-name";
        nameSpan.textContent = dayNames[i];

        const numSpan = document.createElement("span");
        numSpan.className = "day-number";
        numSpan.textContent = d.getDate();

        const countSpan = document.createElement("span");
        countSpan.className = "todo-count";
        countSpan.textContent = count;

        dayDiv.appendChild(nameSpan);
        dayDiv.appendChild(numSpan);
        dayDiv.appendChild(countSpan);

        weekView.appendChild(dayDiv);
    }
}

// 새로운 Todo 추가 함수
function addTodo() {
    const text = todoInput.value.trim();

    if (text === "") {
        errorMessage.style.display = "block";
        return;
    }
    errorMessage.style.display = "none";

    const newTodo = {
        id: generateId(),
        text: text,
        isCompleted: false,
        date: formatDateString(currentDate), // 현재 선택된 날짜
    };

    todos.push(newTodo);
    saveTodos();
    todoInput.value = "";

    renderWeekView(); // Todo 개수 배지 업데이트
    renderTodos();
}

// Todo 삭제 함수
function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderWeekView(); // Todo 개수 배지 업데이트
    renderTodos();
}

// Todo 완료 상태 토글 함수
function toggleCompleteTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    saveTodos();
    renderWeekView(); // 뷰 업데이트
    renderTodos();
}

// Todo 수정 함수
function editTodo(id) {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (!todoToEdit) return;

    const newText = prompt("할 일을 수정하세요:", todoToEdit.text);

    if (newText !== null && newText.trim() !== "") {
        todos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, text: newText.trim() };
            }
            return todo;
        });
        saveTodos();
        renderTodos();
    }
}

// 필터 변경 함수
function setFilter(filterType) {
    currentFilter = filterType;

    filterButtons.forEach((btn) => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderTodos();
}

// 화면에 Todo 목록을 그리는 함수
function renderTodos() {
    todoList.innerHTML = "";

    // 1. 선택된 날짜로 필터링
    const targetDateStr = formatDateString(currentDate);
    let filteredTodos = todos.filter((todo) => todo.date === targetDateStr);

    // 2. 상태 탭으로 필터링
    if (currentFilter === "active") {
        filteredTodos = filteredTodos.filter((todo) => !todo.isCompleted);
    } else if (currentFilter === "completed") {
        filteredTodos = filteredTodos.filter((todo) => todo.isCompleted);
    }

    // 3. 렌더링
    filteredTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.className = "todo-item" + (todo.isCompleted ? " completed" : "");

        const textSpan = document.createElement("span");
        textSpan.className = "todo-text";
        textSpan.textContent = todo.text;

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "todo-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = todo.isCompleted ? "취소" : "완료";
        completeBtn.className = "btn-complete";
        completeBtn.onclick = () => toggleCompleteTodo(todo.id);

        const editBtn = document.createElement("button");
        editBtn.textContent = "수정";
        editBtn.className = "btn-edit";
        editBtn.onclick = () => editTodo(todo.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.className = "btn-delete";
        deleteBtn.onclick = () => deleteTodo(todo.id);

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(actionsDiv);

        todoList.appendChild(li);
    });
}

// 이벤트 리스너: 추가 버튼
addButton.addEventListener("click", addTodo);

// 이벤트 리스너: 엔터키 입력
todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// 에러 메시지 숨김
todoInput.addEventListener("input", function () {
    if (errorMessage.style.display === "block") {
        errorMessage.style.display = "none";
    }
});

// 이벤트 리스너: 상태 필터 버튼
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        setFilter(btn.dataset.filter);
    });
});

// 이전/다음 주 이동 버튼
prevWeekBtn.addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeekView();
});

nextWeekBtn.addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeekView();
});

// 앱 초기화: 주간 뷰 및 투두 목록 렌더링
renderWeekView();
renderTodos();
