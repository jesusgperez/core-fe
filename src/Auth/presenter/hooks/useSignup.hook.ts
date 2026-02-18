import injections from '../injections'
import { useContext } from "react"
import AuthContext from "../contexts/Context"
import { useNavigate } from "react-router-dom"
import { useMutation } from '@tanstack/react-query'
import { ISignupEntity } from '../../domain/models'
import { IServerError } from '../../../common/domain/models'
import { AuthUrls } from '../pages/AuthUrls'


const useSignup = () => {
  const navigate = useNavigate()

  const {
    setModalState
  } = useContext(AuthContext)

  return useMutation<ISignupEntity, Error, ISignupEntity>({
    mutationFn: (data) => injections.AuthUseCase.signupUser(data),
    onSuccess: (data) => {
      setModalState({
        title: "Completar Registro",
        content: `Se ha enviado un correo a ${data.email} para terminar el proceso de registro`,
        open: true
      })
      navigate(AuthUrls.login)
    },
    onError: (e: unknown) => {
      const error = e as IServerError
      setModalState({
        title: "Error",
        content: error.detail,
        open: true
      })
    }
  })
}

export { useSignup }
