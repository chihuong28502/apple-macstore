export const InputField = ({
  type,
  value,
  onChange,
  placeholder,
  error,
  onKeyDown,
}: {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="mb-5 w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
          error ? "border-red-500" : "border-gray-200"
        } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};
