
const FormInput = ({
    label,
    name,
    placeholder = "",
    type = "text",
    value,
    onChange,
    required = false,
    className = "",
    textarea = false, 
    disabled = false, 
  }: FormInputProps) => {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label htmlFor={name} className="text-sm font-medium text-black">
          {label}
        </label>
  
        {textarea ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 h-20 resize-none"
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
          />
        )}
      </div>
    );
  };

export default FormInput;