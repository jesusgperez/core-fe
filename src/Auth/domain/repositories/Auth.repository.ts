import { 
  IChangeEntity,
  ILoginEntity, IRetrieveEntity, ISignupEntity, ITokenEntity
} from "../models/entity";


export interface IAuthRepository {
  // Write your functions interface
  refreshToken(refreshToken: string): Promise<ITokenEntity>;
  loginUser(loginData: ILoginEntity): Promise<ITokenEntity>;
  signupUser(signupData: ISignupEntity): Promise<ISignupEntity>;
  retrievePassword(retrieveData: IRetrieveEntity): Promise<void>;
  changePassword(changeData: IChangeEntity, encryption: string): Promise<IChangeEntity>;
  confirmSignup(encryption: string): Promise<void>;
}
