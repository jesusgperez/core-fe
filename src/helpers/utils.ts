import { AxiosError } from "axios"
import { IServerError } from "../common/domain/models"


export const normalizeText = (text: string) : string => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export const flatErrors = (errors: {[key: string]: string}): string => {
  let response = ""

  for (let key in errors) {
    response += `${key}: ${errors[key]} \n`
  }

  return response
}

export const handleApiErrors = (error: unknown): IServerError => {
  const err = error as AxiosError
  const statusCode = err.response?.status
  const data = err.response!.data as {[key: string]: string}
  let throwError: IServerError = {detail: "", statusCode}

  if (!data.hasOwnProperty("detail")){
    throwError = {detail: flatErrors(data), statusCode}
  } else {
    throwError = {...data as unknown as IServerError, statusCode}
  }

  return throwError
}
