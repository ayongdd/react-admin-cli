import service from '.'
const baseURL = '/login_log'
import { objToParam } from '~/utils'

const list = (data: ApiType.LoginLog.Search) => service.get<ApiType.Page.Result<ApiType.LoginLog.Info>>(`${baseURL}?${objToParam(data)}`)

export const loginLogApi = {
  list
}
