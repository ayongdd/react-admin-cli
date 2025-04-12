import { Navigate, useLocation } from 'react-router'
import { routes } from '..'
import { useAtomValue } from 'jotai'
import { authJotai } from '~/store'
import { _localStorage, storage } from "~/utils/storage"

// * 根据路由地址查找路由
export function findRoute(
  pathname: string,
  routes: Array<RouteType.RouteInfo> = []
): RouteType.RouteInfo {
  let result: RouteType.RouteInfo = {}
  for (const route of routes) {
    if (route.path === pathname) return route
    if (route.children) {
      const res = findRoute(pathname, route.children)
      if (Object.keys(res).length) result = res
    }
  }
  return result
}

/**
 * * 路由守卫 (授权认证校验)
 */
const AuthRouter = ({ children }: { children: JSX.Element }) => {
  // const token = useAtomValue(authJotai.tokenAtom)
  const perms = useAtomValue(authJotai.permAtom)
  const token = storage.get("token") as ApiType.Auth.UserClaim;
  const { pathname } = useLocation()
  // * 找到当前路由的 meta 信息
  const route = findRoute(pathname, routes)
  // * 如果token存在并且访问login页面跳转到 /
  if (token?.accessToken && pathname === '/login') {
    // console.log("route", routes)
    return <Navigate to={route?.path ?? "/tenant/index"} replace />
  }
  if (!token?.accessToken && pathname !== '/login') {
    return <Navigate to="/login" replace />
  }
  // * 不需要认证,直接放行
  if (!route.meta?.requireAuth) return children
  // * 需要认证才能访问
  if (!token?.accessToken || token.accessToken === undefined) {
    return <Navigate to="/login" replace />
  }

  // * 需要有权限才能访问
  if (route.meta.perm && !perms?.includes(route.meta.perm)) {
    return <Navigate to="/403" />
  }

  return children
}

export default AuthRouter
