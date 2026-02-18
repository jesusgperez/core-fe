import { 
  ILoginEntity, ITokenEntity, ISignupEntity, IRetrieveEntity, IChangeEntity
} from "../models";
import { IAuthRepository } from "../repositories";

export class AuthUseCase {
  constructor(readonly Auth: IAuthRepository) {}

  // Write your use case functions
  loginUser = async (loginData: ILoginEntity): Promise<ITokenEntity> =>
    await this.Auth.loginUser(loginData)

  refreshToken = async (refreshToken: string): Promise<ITokenEntity> =>
    await this.Auth.refreshToken(refreshToken)

  signupUser = async (signupData: ISignupEntity): Promise<ISignupEntity> =>
    await this.Auth.signupUser(signupData)

  retrievePassword = async (retrieveData: IRetrieveEntity): Promise<void> =>
    await this.Auth.retrievePassword(retrieveData)

  changePassword = async (changeData: IChangeEntity, encryption: string): Promise<IChangeEntity> =>
    await this.Auth.changePassword(changeData, encryption)

  confirmSignup = async (encryption: string): Promise<void> =>
    await this.Auth.confirmSignup(encryption)

}
