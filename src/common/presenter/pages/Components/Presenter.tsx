import { useState } from "react"
import { IAssetEntity } from "../../../domain/models"
import Component from "./Component"

const dataList: IAssetEntity[] = [
  { name: 'Option A', tag: 'option-a' },
  { name: 'Option B', tag: 'option-b' },
  { name: 'Option C', tag: 'option-c' },
  { name: 'Option D', tag: 'option-d' },
]

const Presenter = () => {
  const [inputValue, setInputValue] = useState('')
  const [modalBaseOpen, setModalBaseOpen] = useState(false)
  const [modalContinueOpen, setModalContinueOpen] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [selectSelected, setSelectSelected] = useState<Set<string>>(new Set())
  const [selectMultiSelected, setSelectMultiSelected] = useState<Set<string>>(new Set())
  const [checkboxGroupSelected, setCheckboxGroupSelected] = useState('')

  return (
    <Component
      inputValue={inputValue}
      setInputValue={setInputValue}
      modalBaseOpen={modalBaseOpen}
      setModalBaseOpen={setModalBaseOpen}
      modalContinueOpen={modalContinueOpen}
      setModalContinueOpen={setModalContinueOpen}
      checkboxChecked={checkboxChecked}
      setCheckboxChecked={setCheckboxChecked}
      selectSelected={selectSelected}
      setSelectSelected={setSelectSelected}
      selectMultiSelected={selectMultiSelected}
      setSelectMultiSelected={setSelectMultiSelected}
      checkboxGroupSelected={checkboxGroupSelected}
      setCheckboxGroupSelected={setCheckboxGroupSelected}
      dataList={dataList}
    />
  )
}

export default Presenter
