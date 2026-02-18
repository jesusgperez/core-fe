import injections from '../injections'
import { useContext } from "react"
import AuthContext from "../contexts/Context"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation } from '@tanstack/react-query'
import { IChangeEntity } from '../../domain/models'
import { IServerError } from '../../../common/domain/models'
import { AuthUrls } from '../pages/AuthUrls'


const useChange = () => {
  const navigate = useNavigate()
  const params = useParams()

  const {
    setModalState
  } = useContext(AuthContext)

  return useMutation<IChangeEntity, Error, IChangeEntity>({
    mutationFn: (data) => injections.AuthUseCase.changePassword(data, params.encrypted!),
    onSuccess: () => {
      setModalState({
        title: "Éxito",
        content: "La contraseña se ha cambiado correctamente, ahora puede iniciar sesión",
        open: true
      })

      navigate(AuthUrls.login)
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

export { useChange }
