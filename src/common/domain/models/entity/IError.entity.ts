export type IError = {
  hasError: boolean,
  message: string
}

export const EmptyError: IError = {
  hasError: false,
  message: ''
}

export type IServerError = {
  detail: string
  statusCode?: number
}
