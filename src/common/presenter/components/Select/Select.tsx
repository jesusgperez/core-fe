import { useState } from "react"
import { SelectProps } from "./models"
import { normalizeText } from "../../../../helpers/utils"
import { IAssetEntity } from "../../../domain/models"
import { ListItem } from "./ListItem"
import { ListSearch } from "./ListSearch"
import { TopItem } from "./TopItem"


const Select = ({
  dataList, selectedOuter, setSelectedOuter, errors,
  placeholder, containerStyles, multiple = false
}: SelectProps) => {

  const [ searchValue, setSearchValue ] = useState<string>('')
  const [ selected, setSelected ] = useState<IAssetEntity[]>([])
  const [ open, setOpen ] = useState<boolean>(false)

  const compareNames = (name: string): boolean => {
    return normalizeText(name).startsWith(searchValue)
  }

  const deleteSelectionMultiple = (data: IAssetEntity) => {
    setSelected(selected.filter(obj => obj.tag !== data.tag))
    selectedOuter?.delete(data.tag)
    setSelectedOuter?.(new Set(selectedOuter))
  }

  const onClickListItem = (data: IAssetEntity) => {
    if (!selected.map(obj => obj.tag).includes(data.tag)) {
      if (multiple) {
        selected.push(data)
        setSelected(selected.filter(obj => obj))
        setSelectedOuter?.(new Set(selectedOuter?.add(data.tag)))
        return
      }

      setSelected([data])
      setSelectedOuter?.(new Set([data.tag]))
    } else {
      deleteSelectionMultiple(data)
    }

    setSearchValue('')
  }

  return (
    <div className={`relative container w-full text-black ${containerStyles}`}>
      <TopItem
        open={open}
        setOpen={setOpen}
        selected={selected}
        errors={errors}
        placeholder={placeholder}
      />

      <ul className={`absolute w-full bg-secondary text-white overflow-y-auto max-h-60 ${!open && 'hidden'} border border-black z-10`}>
        <ListSearch
          value={searchValue}
          setValue={setSearchValue}
        />
        {dataList.map((data) => (
            <ListItem 
              key={data.tag}
              data={data.name}
              show={compareNames(data.name)}
              selected={selected.map(obj => obj.tag).includes(data.tag)}
              onClick={() => onClickListItem(data)}
            />
          )
        )}
          {
            multiple && <button
              className="w-full sticky bottom-0 text-primary bg-orange-200 hover:scale-105"
              onClick={() => setOpen(!open)}
            >
              Cerrar
            </button>
          }
      </ul>
        {multiple && <p className="text-white text-xs">
          *Seleciona varios
        </p>}
    </div>
  )
}

export { Select }
