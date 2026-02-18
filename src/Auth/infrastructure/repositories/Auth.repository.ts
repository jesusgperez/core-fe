import { IChangeEntity, ILoginEntity, IRetrieveEntity, ISignupEntity, ITokenEntity } from "../../domain/models";
import { IChangeDto, ISignupDto, ITokenDto } from "../models/dto";
import { TokenAdapter, SignupAdapter, LoginAdapter, RetrieveAdapter, ChangeAdapter } from "../models";
import { IHttp } from "../../../common/domain/repositories";
import { IAuthRepository } from "../../domain/repositories";
import { getEnvironments } from "../../../helpers";
import { Method } from "axios";
import { HttpMethod } from "../../../common/infrastructure/models/interfaces";
import { AxiosError } from "axios";
import { useLocalStorage } from "../../../common/presenter/hooks";
import { handleApiErrors } from "../../../helpers";

const API_URL : string = getEnvironments().VITE_API_URL


export class AuthRepository implements IAuthRepository {
  constructor(readonly http: IHttp) {}

  //Write async api calls here
  async refreshToken(refreshToken: string): Promise<ITokenEntity> {
    const storage = useLocalStorage()

    try {
      const response = await this.http.request<ITokenDto>({
        method: HttpMethod.post as Method,  
        headers: {},
        params: {},
        body: {
          refresh: refreshToken
        },
        url: `${API_URL}tkauth/token/refresh/`
      })

      const token = TokenAdapter.TokenDtoToTokenEntity({
        access: response.access,
        refresh: refreshToken
      })

      storage.setStorage('token', token)

      return token
    } catch (error: unknown) {
      const err = error as AxiosError
      const data = err.response!.data
      throw {message: data}
    }
  }

  async loginUser(loginData: ILoginEntity): Promise<ITokenEntity> {
    try {
      const sendData = LoginAdapter.LoginEntityToLoginDto(loginData)

      const response = await this.http.request<ITokenDto>({
        method: HttpMethod.post as Method,  
        headers: {},
        params: {},
        body: {...sendData},
        url: `${API_URL}tkauth/login/`
      })

      return TokenAdapter.TokenDtoToTokenEntity(response)
    } catch (error: unknown) {
      throw handleApiErrors(error)
    }
  }

  async signupUser(signupData: ISignupEntity): Promise<ISignupEntity> {
    try {
      const response = await this.http.request<ISignupDto>({
        method: HttpMethod.post as Method,  
        headers: {},
        params: {},
        body: SignupAdapter.SignupEntityToSignupDto(signupData),
        url: `${API_URL}tkauth/signup/`
      })

      return SignupAdapter.SignupDtoToSignupEntity(response)
    } catch (error: unknown) {
      throw handleApiErrors(error)
    }
  }

  async retrievePassword(retrieveData: IRetrieveEntity): Promise<void> {
    try {
      await this.http.request<null>({
        method: HttpMethod.post as Method,  
        headers: {},
        params: {},
        body: RetrieveAdapter.RetrieveEntityToRetrieveDto(retrieveData),
        url: `${API_URL}tkauth/password/retrieve/`
      })
    } catch (error: unknown) {
      throw handleApiErrors(error)
    }
  }

  async changePassword(changeData: IChangeEntity, encryption: string): Promise<IChangeEntity> {
    try {
      const response = await this.http.request<IChangeDto>({
        method: HttpMethod.put as Method,
        headers: {},
        params: {},
        body: ChangeAdapter.ChangeEntityToChangeDto(changeData),
        url: `${API_URL}tkauth/password/change/${encryption}/`
      })

      return ChangeAdapter.ChangeDtoToChangeEntity(response)
    } catch (error: unknown) {
      throw handleApiErrors(error)
    }
  }

  async confirmSignup(encryption: string): Promise<void> {
    try {
      await this.http.request<null>({
        method: HttpMethod.post as Method,
        headers: {},
        params: {},
        body: {},
        url: `${API_URL}tkauth/signup/confirm/${encryption}/`
      })
    } catch (error: unknown) {
      throw handleApiErrors(error)
    }
  }
}
