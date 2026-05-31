type Option<T extends string> = {
    value: T;
    label: string;
};

type SegmentedControlProps<T extends string> = {
    options: [Option<T>, Option<T>, ...Option<T>[]];
    value: T;
    onChange: (value: T) => void;
    className?: string;
};

export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    className = "",
}: SegmentedControlProps<T>) {
    return (
        <div
            className={`inline-flex w-fit items-center rounded-full border border-gray-300 bg-white p-0.5 ${className}`}
        >
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${isActive
                            ? "bg-orange-200 text-orange-800 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
