import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import injections from '../injections'
import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { ILoginEntity, ITokenEntity } from '../../domain/models'
import { useLocalStorage } from '../../../common/presenter/hooks'
import { GlobalContext } from '../../../common/presenter/contexts/global'
import AuthContext from '../contexts/Context'
import { IDecodedTokenDto } from '../../infrastructure/models'
import { IServerError } from '../../../common/domain/models'
import { AuthUrls } from '../pages/AuthUrls'


const useLogin = () => {
  const { setUser } = useContext(GlobalContext)
  const { setModalState } = useContext(AuthContext)
  const navigate = useNavigate()

  return useMutation<ITokenEntity, Error, ILoginEntity>({
    mutationFn: (data) => injections.AuthUseCase.loginUser(data),
    onSuccess: (data) => {
      const storage = useLocalStorage()
      storage.setStorage('token', data)

      const decodedData: IDecodedTokenDto = jwtDecode(data.accessToken)

      setUser({
        firstName: decodedData.first_name,
        lastName: decodedData.last_name,
        email: decodedData.email,
        username: decodedData.username
      })

      navigate(AuthUrls.home)
      return
    },
    onError: (e: unknown) => {
      const error = e as IServerError
      setModalState({
        open: true,
        title: "Error",
        content: error.statusCode === 500
          ? "Estamos teniendo problemas, por favor intente más tarde"
          : error.detail
      })
    }
  })
}

export { useLogin }
