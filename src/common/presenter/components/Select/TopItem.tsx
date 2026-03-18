import { TopItemProps } from "./models"
import { BiChevronDown } from "react-icons/bi"


const TopItem = ({open, selected, setOpen, errors, placeholder} : TopItemProps) => {
  const shortenName = (name: string) :string => {
    return name.length > 20 ? name.substring(0,20) + "..." : name
  }

  const hasError = errors ? errors.hasError : false

  return (
    <div className="flex flex-col">
      <div
        onClick={() => setOpen(!open)}
        className={`w-full p-2 flex items-center justify-between border border-muted text-sm rounded-md ${!selected.length && 'text-gray-400 text-xs' || 'text-sm'} ${open && 'rounded-none rounded-t-md' || ''}`}
      >
        {selected.length ? selected.map(obj => shortenName(obj.name)).join(', ') : placeholder}

        <BiChevronDown 
          size={20}
          className={`${open && 'rotate-180' || 'rotate-360'} duration-200`}
          />
      </div>
      <p className={`text-xs text-danger ${!hasError ? 'hidden' : 'block'}`}>
        {errors ? errors.message : ""}
      </p>
    </div>
  )
}

export { TopItem }
