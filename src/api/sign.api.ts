import service from '.'
const baseURL = '/sign'
import { objToParam } from '~/utils'

const operate = (req: ApiType.Sign.Operate) => {
  return service.post<ApiType.Response.Res<string>>(`${baseURL}/operate`, req)
}
const list = (data: ApiType.Sign.Search) => service.get<ApiType.Page.Result<ApiType.Tenant.Info>>(`${baseURL}?${objToParam(data)}`)
const ipaInfo = (ipa: File) => {
  const data = new FormData()
  data.append("ipa", ipa)
  return service.post<ApiType.Sign.IpaInfo>(`${baseURL}/ipa_info`, data)
}
const getDownloadUrl = (id: string, tenant_id?: string) => service.get<string>(`${baseURL}/download/${id}${tenant_id ? `?tenant_id=${tenant_id}` : ""}`)
export const signApi = {
  operate,
  list,
  ipaInfo,
  getDownloadUrl
}
