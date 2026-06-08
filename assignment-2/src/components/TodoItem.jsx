import { useState, useRef, useEffect } from "react";

function TodoItem({ todo, onToggleComplete, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const editInputRef = useRef(null);

    // 수정 모드 진입 시 입력창에 포커스
    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [isEditing]);

    const handleEditStart = () => {
        setEditText(todo.text);
        setIsEditing(true);
    };

    const handleEditSave = () => {
        const trimmed = editText.trim();
        if (trimmed !== "") {
            onEdit(todo.id, trimmed);
            setIsEditing(false);
        }
    };

    const handleEditCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    const handleEditKeyDown = (e) => {
        if (e.key === "Enter") {
            handleEditSave();
        } else if (e.key === "Escape") {
            handleEditCancel();
        }
    };

    const itemBase =
        "flex animate-slide-in items-center justify-between border-b border-gray-100 py-4 transition-all duration-300 last:border-b-0";

    // 수정 모드일 때 인라인 입력 UI 표시
    if (isEditing) {
        return (
            <li className={itemBase}>
                <div className="flex flex-1 items-center gap-2 pr-2">
                    <input
                        ref={editInputRef}
                        type="text"
                        className="flex-1 animate-edit-fade rounded-md border-2 border-primary px-3 py-2 text-[15px] outline-none transition-colors duration-200 focus:border-primary-hover"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                    />
                    <button
                        className="cursor-pointer whitespace-nowrap rounded-md border-none bg-primary px-3 py-1.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
                        onClick={handleEditSave}
                    >
                        저장
                    </button>
                    <button
                        className="cursor-pointer whitespace-nowrap rounded-md border-none bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-200"
                        onClick={handleEditCancel}
                    >
                        취소
                    </button>
                </div>
            </li>
        );
    }

    // 기본 보기 모드
    return (
        <li className={itemBase}>
            <span
                className={`flex-1 break-all pr-4 text-base transition-colors duration-300 ${
                    todo.isCompleted ? "text-gray-400 line-through" : ""
                }`}
            >
                {todo.text}
            </span>
            <div className="flex gap-2">
                <button
                    className={`cursor-pointer rounded-md border-none px-2.5 py-1.5 text-sm transition-all duration-200 ${
                        todo.isCompleted
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-primary-light text-primary hover:bg-primary-light-hover"
                    }`}
                    onClick={() => onToggleComplete(todo.id)}
                >
                    {todo.isCompleted ? "취소" : "완료"}
                </button>
                <button
                    className="cursor-pointer rounded-md border-none bg-gray-100 px-2.5 py-1.5 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-200"
                    onClick={handleEditStart}
                >
                    수정
                </button>
                <button
                    className="cursor-pointer rounded-md border-none bg-danger-light px-2.5 py-1.5 text-sm text-danger transition-all duration-200 hover:bg-danger-light-hover"
                    onClick={() => onDelete(todo.id)}
                >
                    삭제
                </button>
            </div>
        </li>
    );
}

export default TodoItem;
