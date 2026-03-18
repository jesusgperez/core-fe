import React from "react"
import { colors } from "../../../../theme/colors"
import { IAssetEntity } from "../../../domain/models"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { CheckBox } from "../../components/CheckBox"
import { CheckBoxGroup } from "../../components/CheckBoxGroup"
import { Select } from "../../components/Select"
import { Modal } from "../../components/Modal"
import { ModalTypes } from "../../components/Modal/models"

type ComponentProps = {
  inputValue: string
  setInputValue: (value: string) => void
  modalBaseOpen: boolean
  setModalBaseOpen: (open: boolean) => void
  modalContinueOpen: boolean
  setModalContinueOpen: (open: boolean) => void
  checkboxChecked: boolean
  setCheckboxChecked: React.Dispatch<React.SetStateAction<boolean>>
  selectSelected: Set<string>
  setSelectSelected: React.Dispatch<React.SetStateAction<Set<string>>>
  selectMultiSelected: Set<string>
  setSelectMultiSelected: React.Dispatch<React.SetStateAction<Set<string>>>
  checkboxGroupSelected: string
  setCheckboxGroupSelected: React.Dispatch<React.SetStateAction<string>>
  dataList: IAssetEntity[]
}

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
    {title}
  </h2>
)

const VariantLabel = ({ label }: { label: string }) => (
  <span className="text-sm text-gray-500 mb-1 block">{label}</span>
)

const Component = ({
  inputValue,
  setInputValue,
  modalBaseOpen,
  setModalBaseOpen,
  modalContinueOpen,
  setModalContinueOpen,
  checkboxChecked,
  setCheckboxChecked,
  selectSelected,
  setSelectSelected,
  selectMultiSelected,
  setSelectMultiSelected,
  checkboxGroupSelected,
  setCheckboxGroupSelected,
  dataList,
}: ComponentProps) => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-2xl mx-auto p-8 space-y-12">
        <h1 className="text-3xl font-bold text-gray-900">Component Catalog</h1>

        {/* Colors */}
        <section>
          <SectionTitle title="Colors" />
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(colors).map(([name, hex]) => (
              <div key={name} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded border border-gray-200 shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Button */}
        <section>
          <SectionTitle title="Button" />
          <div className="space-y-4">
            <div>
              <VariantLabel label="Default" />
              <Button
                text="Click me"
                onClick={() => {}}
                customStyles="bg-blue-600 text-white"
              />
            </div>
            <div>
              <VariantLabel label="Disabled" />
              <Button
                text="Disabled"
                onClick={() => {}}
                customStyles="bg-blue-600 text-white"
                enabled={false}
              />
            </div>
          </div>
        </section>

        {/* Input */}
        <section>
          <SectionTitle title="Input" />
          <div className="space-y-4">
            <div>
              <VariantLabel label="Default" />
              <Input
                value={inputValue}
                setValue={setInputValue}
                placeholder="Type something..."
              />
            </div>
            <div>
              <VariantLabel label="With error" />
              <Input
                value=""
                setValue={() => {}}
                placeholder="Email"
                errors={{ hasError: true, message: 'This field is required' }}
              />
            </div>
            <div>
              <VariantLabel label="Password" />
              <Input
                value=""
                setValue={() => {}}
                placeholder="Password"
                type="password"
              />
            </div>
          </div>
        </section>

        {/* CheckBox */}
        <section>
          <SectionTitle title="CheckBox" />
          <CheckBox
            id="demo-checkbox"
            title="Accept terms and conditions"
            setOuterCheck={setCheckboxChecked}
          />
          {checkboxChecked && (
            <p className="text-sm text-green-600 mt-2">Checked!</p>
          )}
        </section>

        {/* CheckBoxGroup */}
        <section>
          <SectionTitle title="CheckBoxGroup" />
          <CheckBoxGroup
            title="Select an option"
            options={dataList}
            setOuterChecked={setCheckboxGroupSelected}
          />
          {checkboxGroupSelected && (
            <p className="text-sm text-gray-600 mt-2">Selected: {checkboxGroupSelected}</p>
          )}
        </section>

        {/* Select */}
        <section>
          <SectionTitle title="Select" />
          <div className="space-y-4">
            <div>
              <VariantLabel label="Single select" />
              <Select
                dataList={dataList}
                placeholder="Choose one..."
                selectedOuter={selectSelected}
                setSelectedOuter={setSelectSelected}
              />
            </div>
            <div>
              <VariantLabel label="Multiple select" />
              <Select
                dataList={dataList}
                placeholder="Choose multiple..."
                selectedOuter={selectMultiSelected}
                setSelectedOuter={setSelectMultiSelected}
                multiple
              />
            </div>
          </div>
        </section>

        {/* Modal */}
        <section>
          <SectionTitle title="Modal" />
          <div className="flex gap-4">
            <div>
              <VariantLabel label="Base (exit only)" />
              <Button
                text="Open Modal"
                onClick={() => setModalBaseOpen(true)}
                customStyles="bg-gray-700 text-white"
              />
            </div>
            <div>
              <VariantLabel label="Continue (two actions)" />
              <Button
                text="Open Modal"
                onClick={() => setModalContinueOpen(true)}
                customStyles="bg-gray-700 text-white"
              />
            </div>
          </div>
        </section>
      </div>

      <Modal
        title="Information"
        content="This is a base modal with a single exit action."
        open={modalBaseOpen}
        onExit={() => setModalBaseOpen(false)}
        type={ModalTypes.base}
      />
      <Modal
        title="Confirm action"
        content="Are you sure you want to continue with this action?"
        open={modalContinueOpen}
        onExit={() => setModalContinueOpen(false)}
        onContinue={() => setModalContinueOpen(false)}
        type={ModalTypes.continue}
      />
    </div>
  )
}

export default Component
