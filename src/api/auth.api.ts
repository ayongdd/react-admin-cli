import service from '.'

const baseURL = '/auth'

const login = (data: ApiType.Auth.Login) => service.post<ApiType.Auth.UserClaim>(`${baseURL}/login`, data)
const getInfo = () => service.get<ApiType.Auth.Info>(`${baseURL}/info`)
const refresh = (data: ApiType.Auth.Refresh) => service.post<ApiType.Auth.UserClaim>(`${baseURL}/refresh`, data)

export const authApi = {
  login,
  getInfo,
  refresh
}
