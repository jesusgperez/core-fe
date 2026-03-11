import injections from '../injections'
import { useContext } from "react"
import AuthContext from "../contexts/Context"
import { useNavigate } from "react-router-dom"
import { useMutation } from '@tanstack/react-query'
import { IRetrieveEntity } from '../../domain/models'
import { AuthUrls } from '../pages/AuthUrls'


const useRetrieve = () => {
  const navigate = useNavigate()

  const {
    setModalState
  } = useContext(AuthContext)

  return useMutation<void, Error, IRetrieveEntity>({
    mutationFn: (data) => injections.AuthUseCase.retrievePassword(data),
    onSuccess: () => {
      setModalState({
        title: "Éxito",
        content: "En caso de existir la cuenta, se ha enviado un correo para recuperar la contraseña",
        open: true
      })

      navigate(AuthUrls.login)
    },
    onError: () => {
      setModalState({
        title: "Éxito",
        content: "En caso de existir la cuenta, se ha enviado un correo para recuperar la contraseña",
        open: true
      })

      navigate(AuthUrls.login)
    }
  })
}

export { useRetrieve }
