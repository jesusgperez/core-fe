import { ModalProps } from "./models"
import { ModalTitle } from "./ModalTitle"
import { ModalTypes } from "./models"
import { ModalExitAction } from "./ModalExitAction"
import { ModalContinueAction } from "./ModalContinueAction"

const Modal = (
  {title, content, type, open, onExit, onContinue}: ModalProps
) => {
  const renderActions = () => {
    if (type === ModalTypes.continue) {
      if (!onContinue) {
        throw new Error('Should provide an onContinue function')
      }

      return <ModalContinueAction
        onExit={onExit}
        onContinue={onContinue}
      />
    }

    return <ModalExitAction
      onExit={onExit}
    />
  }

  return (
    <div
      className={`absolute top-0 flex bg-gray-500 bg-opacity-30 h-screen w-full ${!open && 'hidden'} items-center justify-center z-50`}
      onClick={onExit}
    >
      <div
        className="flex flex-col w-3/4 -mt-28 px-5 py-10 bg-white border border-primary rounded-lg items-center justify-center shadow-xl space-y-2 lg:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalTitle text={title} />
        <div className="flex flex-col text-lg px-5 py-10 items-center">
          {content}
        </div>
        {renderActions()}
      </div>
  
    </div>
  )
}

export { Modal }
