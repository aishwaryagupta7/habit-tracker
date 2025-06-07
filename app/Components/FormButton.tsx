const FormButton = ({label,onClick,className,disabled}: {label: string; onClick: () => void; className?: string; disabled?: boolean}) => {
    return (
      <button
              onClick={onClick}
              className={` rounded-md text-xs  p-2  ${className}`} disabled={disabled} >
              {label}
          </button>
    )
}
export default FormButton;