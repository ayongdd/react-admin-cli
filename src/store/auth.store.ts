import { atomWithStorage } from "jotai/utils"

const tokenAtom = atomWithStorage<ApiType.Auth.UserClaim | undefined>("token", undefined)
const authInfoAtom = atomWithStorage<ApiType.Auth.Info | undefined>("info", undefined)
const permAtom = atomWithStorage<string[]>("perm", [
  "home",
  "system",
  "tenant",
  "tenant:index",
  "loginLog:index",
  "profile",
  "system:account",
  "system:perm",
  "system:log",
  "system:user",
  "system:tenant",
  "sign",
  "sign:index",
  "sign:add",
])

export const authJotai = {
  tokenAtom,
  authInfoAtom,
  permAtom
}
