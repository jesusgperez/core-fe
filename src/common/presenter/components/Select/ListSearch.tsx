import { ListSearchProps } from "./models"
import { normalizeText } from "../../../../helpers/utils"
import { CiSearch } from "react-icons/ci"


const ListSearch = ({value, setValue} : ListSearchProps) => {
  return (
    <div className="sticky top-0 flex flex-row h-10">
      <div className="p-2 w-11/12">
        <input
            type="text"
            value={value}
            placeholder="Buscar"
            className="w-full text-sm text-left placeholder:text-gray-400 outline-none"
            onChange={(e) => setValue(normalizeText(e.target.value))
            }
        />
      </div>
      <div className="relative w-1/12 h-10">
        <CiSearch className="absolute top-3" size={18} />
      </div>
    </div>
  )
}

export { ListSearch }
