import { Navigate, useRoutes } from 'react-router'
import Login from '~/pages/login'
import BizRoutes from './routes'

export const routes: RouteType.RouteInfo[] = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录',
      key: 'login'
    }
  },
  ...BizRoutes,
  {
    path: '*',
    element: <Navigate to="/404" />
  }
]

const Router = () => useRoutes(routes)

export default Router
