import service from '.'

const baseURL = '/user'

const create = (data: ApiType.User.Info) => service.post(`${baseURL}`, data)
const modify = (data: ApiType.User.Info) => service.put(`${baseURL}`, data)
const remove = (id: number) => service.delete(`${baseURL}/${id}`)
const updatePassword = (data: ApiType.User.UpdatePassword) => service.put(`${baseURL}/password`, data)
const info = (id: number) => service.get<ApiType.User.Info>(`${baseURL}/${id}`)
const list = (params: ApiType.Page.Param & Record<string, string>) =>
  service.get<ApiType.Page.Result<ApiType.User.Info>>(
    `${baseURL}?${new URLSearchParams(params).toString()}`
  )

export const userApi = {
  create,
  modify,
  remove,
  updatePassword,
  info,
  list
}
