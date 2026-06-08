import TodoItem from "./TodoItem.jsx";

function TodoList({ todos, onToggleComplete, onEdit, onDelete }) {
    if (todos.length === 0) {
        return (
            <ul className="list-none p-0">
                <li className="py-8 text-center text-[15px] text-gray-400">
                    등록된 할 일이 없습니다.
                </li>
            </ul>
        );
    }

    return (
        <ul className="list-none p-0">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

export default TodoList;
