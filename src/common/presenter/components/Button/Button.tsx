import { ButtonProps } from "./models"

const Button = ({text, customStyles, enabled, onClick}: ButtonProps) => {
  return (
    <button
      className={enabled === false ? `px-10 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed` : `px-10 py-2 rounded-lg ${customStyles} hover:shadow-lg hover:bg-opacity-80 hover:-translate-y-0.5 transition duration-500`}
      onClick={onClick}
      disabled={enabled === false}
    >
      {text}
    </button>
  )
}

export { Button }
