import { AuthBackgroundLayout } from "../../layouts"
import { AuthTitle } from "../../components"


const Component = () => {
  return (
    <AuthBackgroundLayout>
      <div
        className="flex flex-col justify-center items-center w-full h-full"
      >
        <AuthTitle
          title="Confirmando registro"
          content="Estamos confirmando tu registro, por favor espera..."
        />
      </div>
    </AuthBackgroundLayout>
  )
}


export default Component
