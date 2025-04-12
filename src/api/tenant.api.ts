
import { objToParam } from '~/utils'
import service from '.'
import type { UploadFile } from 'antd'

const baseURL = '/tenant'

const list = (params: ApiType.Page.Param) =>
  service.get<ApiType.Page.Result<ApiType.Tenant.Info>>(
    `${baseURL}?${objToParam(params)}`
  )
const create = (data: ApiType.Tenant.Info) => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("p12Cert", data.p12Cert)
  formData.append("p12CertPassword", data.p12CertPassword)
  formData.append("mobileProvision", data.mobileProvision)
  formData.append("account", data.account)
  formData.append("password", data.password)


  return service.post(`${baseURL}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
const update = (data: ApiType.Tenant.Info) => {
  const formData = new FormData()
  formData.append("id", data.id.toString())
  if (data.name) {
    formData.append("name", data.name)
  }
  console.log("val", data);
  if (typeof data.p12Cert === 'object') {
    formData.append("p12Cert", data.p12Cert)
  }
  if (typeof data.mobileProvision === 'object') {
    formData.append("mobileProvision", data.mobileProvision)
  }
  if (data.p12CertPassword) {
    formData.append("p12CertPassword", data.p12CertPassword)
  }
  if (data.account) {
    formData.append("account", data.account)
  }
  if (data.password) {
    formData.append("password", data.password)
  }


  return service.put(`${baseURL}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
const info = (id: number) => service.get<ApiType.Tenant.Info>(`${baseURL}/${id}`)
const del = (id: number) => service.delete<ApiType.Response.Res<string>>(`${baseURL}/${id}`)
const getPresignedUrl = (key: string) => service.post<string>(`${baseURL}/upload/signed_url`, {
  key
})
const getP12Password = (data: { tenantId: number, password: string }) => service.post<string>(`${baseURL}/password`, data)
const getBid = <T extends UploadFile>(data: T) => {
  const formData = new FormData()
  formData.append("mobileprovision", data as unknown as File)
  return service.post<ApiType.Response.Res<any>>(`${baseURL}/get_bid`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
const getCertInfo = <T extends UploadFile<any>>(data: {p12Password: string, file: T | any}) => {
  const formData = new FormData()
  formData.append("p12Cert", data.file)
  formData.append("p12Password", data.p12Password);
  return service.post<ApiType.Response.Res<string>>(`${baseURL}/get_cert_info`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const tenantApi = {
  create,
  update,
  info,
  list,
  getPresignedUrl,
  getP12Password,
  del,
  getBid,
  getCertInfo
}
