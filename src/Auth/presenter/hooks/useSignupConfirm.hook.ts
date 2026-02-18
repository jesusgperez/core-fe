import injections from '../injections'
import { useContext } from "react"
import AuthContext from "../contexts/Context"
import { useParams } from "react-router-dom"
import { useMutation } from '@tanstack/react-query'
import { IServerError } from '../../../common/domain/models'


const useSignupConfirm = () => {
  const params = useParams()

  const {
    setModalState
  } = useContext(AuthContext)

  return useMutation<void, Error, void>({
    mutationFn: () => injections.AuthUseCase.confirmSignup(params.encrypted!),
    onSuccess: () => {
      setModalState({
        title: "Éxito",
        content: "Usuario creado con éxito",
        open: true
      })
    },
    onError: (e: unknown) => {
      const error = e as IServerError

      setModalState({
        title: "Error",
        content: error.statusCode === 500
          ? "Estamos teniendo problemas, por favor intente más tarde"
          : error.detail,
        open: true
      })
    }
  })
}

export { useSignupConfirm }
