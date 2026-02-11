import Axios, {AxiosInstance} from "axios";
import { IHttp } from "../../domain/repositories";
import { IRequestOption } from "../../domain/repositories";

export class Http implements IHttp {
  axios: AxiosInstance;
  constructor() {
    this.axios = Axios.create()
  }

  request = async <T>(requestOption: IRequestOption): Promise<T> => {
    const response = await this.axios.request({
      method: requestOption.method,
      url: requestOption.url,
      params: requestOption.params,
      data: requestOption.body,
      headers: {
        ...requestOption.headers
      }
    })

    return response.data
  }
}
