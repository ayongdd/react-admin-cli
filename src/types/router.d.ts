declare namespace RouteType {
  type RouteMeta = {
    title: string
    key: string
    requireAuth?: boolean
    perm?: string
    hidden?: boolean
    icon?: React.ReactNode
  }

  type RouteInfo = {
    path?: string
    element?: React.ReactNode
    meta?: RouteMetaType
    children?: RouteInfo[]
  }
}
