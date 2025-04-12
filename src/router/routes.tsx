import AppLayout from "~/layout";
import { HomeTwo, Data, Agreement } from "@icon-park/react";
import React from "react";
import lazyLoad from "./helper/lazyLoad";

// 基础路由配置
const baseRouters: RouteType.RouteInfo[] = [
	// * 通用路由
	{
		element: <AppLayout />,
		children: [
			// {
			// 	path: "/",
			// 	element: <Home />,
			// 	meta: {
			// 		title: "首页",
			// 		key: "/",
			// 		requireAuth: true,
			// 		perm: "home",
			// 		icon: <HomeTwo theme="outline" size="18" strokeLinecap="square" />,
			// 	},
			// },
			{
				path: "/profile",
				element: lazyLoad(React.lazy(() => import("~/pages/common/profile"))),
				meta: {
					title: "个人中心",
					key: "/profile",
					requireAuth: true,
					perm: "profile",
					hidden: true,
					icon: <HomeTwo theme="outline" size="18" strokeLinecap="square" />,
				},
			},
		],
	},
	// * 错误页面路由
	{
		element: <AppLayout />,
		children: [
			{
				path: "/403",
				element: lazyLoad(
					React.lazy(() => import("~/pages/error/Unauthorized")),
				),
				meta: {
					title: "未授权",
					key: "403",
					requireAuth: true,
				},
			},
			{
				path: "/404",
				element: lazyLoad(React.lazy(() => import("~/pages/error/NotFound"))),
				meta: {
					title: "页面飞走了~",
					key: "404",
				},
			},
		],
	},
];

// 管理员路由配置
const adminRoutes: RouteType.RouteInfo[] = [
	// * 商户管理
	{
		element: <AppLayout />,
		meta: {
			key: "/tenant",
			title: "商户管理",
			requireAuth: true,
			perm: "tenant",
			icon: <Data theme="outline" size="18" strokeLinecap="square" />,
		},
		children: [
			{
				path: "/tenant/index",
				element: lazyLoad(React.lazy(() => import("~/pages/tenant/index"))),
				meta: {
					title: "商户列表",
					key: "/tenant/index",
					requireAuth: true,
					perm: "tenant:index",
				},
			},
			{
				path: "/tenant/loginLog",
				element: lazyLoad(React.lazy(() => import("~/pages/loginLog/index"))),
				meta: {
					title: "商户登录日志",
					key: "/tenant/loginLog",
					requireAuth: true,
					perm: "loginLog:index",
				},
			},
		],
	},
];

// 普通用户路由配置
const userRoutes: RouteType.RouteInfo[] = [
	// * 签名管理
	{
		element: <AppLayout />,
		meta: {
			key: "/sign",
			title: "签名管理",
			requireAuth: true,
			perm: "sign",
			icon: <Agreement theme="outline" size="18" strokeLinecap="square" />,
		},
		children: [
			{
				path: "/sign/add",
				element: lazyLoad(React.lazy(() => import("~/pages/sign/add"))),
				meta: {
					title: "新增签名",
					key: "/sign/add",
					requireAuth: true,
					perm: "sign:add",
				},
			},
		],
	},
];

// 根据用户权限动态生成路由
const generateRoutes = (): RouteType.RouteInfo[] => {
	return [...baseRouters, ...adminRoutes, ...userRoutes];
};

// 导出路由配置
const AllRouters = generateRoutes();

export default AllRouters;
