function FilterTabs({ currentFilter, onFilterChange }) {
    const filters = [
        { key: "all", label: "전체" },
        { key: "active", label: "진행 중" },
        { key: "completed", label: "완료" },
    ];

    return (
        <div className="mt-2.5 mb-5 flex gap-2 border-b border-gray-200 pb-4">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    className={`cursor-pointer rounded-[20px] border-none px-4 py-2 text-sm transition-all duration-200 ${
                        currentFilter === filter.key
                            ? "bg-primary font-semibold text-white"
                            : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                    onClick={() => onFilterChange(filter.key)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

export default FilterTabs;
