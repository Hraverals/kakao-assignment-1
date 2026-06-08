import { useState } from "react";

function TodoInput({ onAdd }) {
    const [text, setText] = useState("");
    const [showError, setShowError] = useState(false);

    const handleAdd = () => {
        const trimmed = text.trim();
        if (trimmed === "") {
            setShowError(true);
            return;
        }
        setShowError(false);
        onAdd(trimmed);
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    const handleChange = (e) => {
        setText(e.target.value);
        if (showError) {
            setShowError(false);
        }
    };

    return (
        <>
            <div className="mb-2 flex gap-2.5">
                <input
                    type="text"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-base outline-none transition-colors duration-200 focus:border-primary"
                    placeholder="선택된 날짜의 할 일을 입력하세요..."
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="cursor-pointer rounded-lg border-none bg-primary px-5 text-base font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
                    onClick={handleAdd}
                >
                    추가
                </button>
            </div>
            {showError && (
                <p className="mb-4 animate-fade-in pl-1 text-[13px] text-danger">
                    할 일을 입력해주세요.
                </p>
            )}
        </>
    );
}

export default TodoInput;
