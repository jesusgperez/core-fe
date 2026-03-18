import { InputProps } from "./models"

const Input = ({
  errors, containerStyles, customStyles, placeholder, value, setValue, type
}: InputProps) => {
  const hasError = errors ? errors.hasError : false

  return (
    <div className={`flex flex-col ${containerStyles} `}>
      <input
        className={`container outline-none rounded-lg border border-black h-9 text-center ${customStyles} ${!!value ? 'text-sm' : 'text-xs'}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={`${type || 'text'}`}
      />
      <p className={`text-xs text-danger ${!hasError ? 'hidden' : 'block'}`}>
        {errors ? errors.message : ""}
      </p>
    </div>
  )
}

export { Input }
