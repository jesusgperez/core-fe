import { Button } from "../Button"
import { ModalContinueActionProps } from "./models"

const ModalContinueAction = (
  {onExit, onContinue}: ModalContinueActionProps
) => {
  return (
    <div className="flex flex-col space-y-4 justify-around w-full md:flex-row md:space-y-0 md:space-x-4">
      <Button
        text="Salir"
        onClick={onExit}
        customStyles="bg-danger w-full md:w-1/3"
      />
      <Button
        text="Continuar"
        onClick={onContinue}
        customStyles="bg-success w-full md:w-1/3"
      />
    </div>
  )
}

export { ModalContinueAction }
