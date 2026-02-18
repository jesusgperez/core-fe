import { useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSignupConfirm } from "../../hooks"
import Component from "./Component"
import AuthContext from "../../contexts/Context"
import { Modal, ModalTypes, DefaultModalState } from "../../../../common/presenter/components"
import { AuthUrls } from "../AuthUrls"


const Presenter = () => {
  const navigate = useNavigate()
  const { mutateAsync: confirmSignup } = useSignupConfirm()
  const { modalState, setModalState } = useContext(AuthContext)

  const hasCalled = useRef(false)

  useEffect(() => {
    if (!hasCalled.current) {
      hasCalled.current = true
      confirmSignup()
    }
  }, [])

  return (
    <>
      <Component />

      <Modal
        title={modalState.title}
        content={modalState.content}
        open={modalState.open}
        type={ModalTypes.base}
        onExit={() => {
          setModalState(DefaultModalState)
          navigate(AuthUrls.login)
        }}
      />
    </>
  )
}


export default Presenter
