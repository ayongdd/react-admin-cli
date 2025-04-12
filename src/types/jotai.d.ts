declare namespace JotaiType {
  type Auth = {
    token: string | undefined
    accountInfo?: AccountInfo | undefined
    permissions?: Array<string>
    setToken: (token: string) => void
    setUserInfo: (info: UserInfo) => void
    setPermissions: (permissions: Array<string>) => void
  }
}
