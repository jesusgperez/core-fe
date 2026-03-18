import { useState } from "react"
import { CheckBoxGroupProps } from "./models"
import { IAssetEntity } from "../../../domain/models"


const CheckBoxGroup = (props: CheckBoxGroupProps) => {
  const [ selected, setSelected  ]  = useState<IAssetEntity>(
    {name: '', tag: ''}
  )

  const onChange = (data: IAssetEntity) => {
    if (data.tag === selected.tag) {
      setSelected({name: '', tag: ''})
      props.setOuterChecked ? props.setOuterChecked('') : ''
    } else {
      setSelected(data)
      props.setOuterChecked ? props.setOuterChecked(data.tag) : ''
    }
  }

  const hasError = props.errors ? props.errors.hasError : false

  return (
    <div className={`border border-1 border-muted rounded-lg flex space-x-5 px-2 py-2 ${props.containerStyles} h-12 md:h-9 items-center justify-center`}>

      <div className="flex flex-col">
        <h3 className={`text-muted text-xs ${props.title ? '' : 'hidden' }`}>
          {props.title}
        </h3>
        <p className={`text-xs text-red-500 ${!hasError ? 'hidden' : 'block'}`}>
          {props.errors ? props.errors.message : ""}
        </p>
      </div>

      {props.options.map(option => (
        <div key={option.tag} className="flex items-center">
          <input
            id={`checkbox-${option.tag}`}
            type="checkbox"
            checked={option.tag === selected.tag}
            onChange={() => onChange(option)}
          />
          <label
            htmlFor={`checkbox-${option.tag}`} className="ml-2 text-xs"
          >
            {option.name}
          </label>
        </div>
      ))}
    </div>
  )
}

export { CheckBoxGroup }
