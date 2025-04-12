import { ActivitySource, HamburgerButton } from "@icon-park/react";
import { Menu, type MenuProps } from "antd";
import { useAtomValue } from "jotai";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import BizRoutes from "~/router/routes";
import { authJotai } from "~/store";
import { createStyles } from "antd-style";

type MenuItem = Required<MenuProps>["items"][number];

const useStyles = createStyles(() => {
	return {
		logoContainer: {
			padding: "10px 0",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "56px",
		},
		logoTitle: {
			marginLeft: "8px",
			maxWidth: "120px",
			flexShrink: "0",
			fontSize: "18px",
			// color: token.colorPrimary,
			fontWeight: "bold",
			color: "white",
		},
		menuContainer: {
			flex: "1",
			marginTop: "4px",
			overflowY: "auto",
			".ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title": {
				color: "#ffffff !important", // 设置选中的父菜单背景色
			},
		},
	};
});

const getOpenKeys = (path: string) => {
	let newStr = "";
	const newArr = [];
	const arr = path.split("/").map((i) => `/${i}`);
	for (let i = 1; i < arr.length - 1; i++) {
		newStr += arr[i];
		newArr.push(newStr);
	}
	return newArr;
};

const AppNav: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
	const { styles } = useStyles();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const title = import.meta.env.VITE_APP_TITLE;
	const perms = useAtomValue(authJotai.permAtom);
	const [menuList, setMenuList] = React.useState<MenuItem[]>([]);
	const [openKeys, setOpenKeys] = React.useState<string[]>([]);
	const [selectedKeys, setSelectedKeys] = React.useState<string[]>([pathname]);
	const clickMenu = ({ key }: { key: string }) => {
		navigate(key);
	};

	const onOpenChange = (openKeys: string[]) => {
		if (openKeys.length === 0 || openKeys.length === 1)
			return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

	React.useEffect(() => {
		setSelectedKeys([pathname]);
		if (collapsed) {
			setOpenKeys(getOpenKeys(pathname));
		}
	}, [pathname, collapsed]);

	React.useEffect(() => {
		const filterAndConvertMenuByPerms = (
			routes: RouteType.RouteInfo[],
			perms: string[],
		): MenuItem[] => {
			return routes.flatMap((route) => {
				if (route.children) {
					const filteredChildren = filterAndConvertMenuByPerms(
						route.children,
						perms,
					);
					if (filteredChildren.length > 0 && route.meta?.key) {
						return [
							{
								key: route.meta.key,
								label: route.meta.title,
								icon: route.meta.icon,
								children: filteredChildren,
							},
						];
					}
					return filteredChildren;
				}
				if (
					route.meta?.perm &&
					perms.includes(route.meta.perm) &&
					!route.meta.hidden
				) {
					return [
						{
							key: route.meta.key,
							label: route.meta.title,
							icon: route.meta.icon ?? (
								<HamburgerButton theme="outline" size="14" />
							),
						},
					];
				}
				return [];
			});
		};

		const filterMenuList = filterAndConvertMenuByPerms(BizRoutes, perms);
		setMenuList(filterMenuList);
	}, [perms]);

	return (
		<React.Fragment>
			<div className={styles.logoContainer}>
				{/* <img src={AppLogo} alt="logo" /> */}
				<ActivitySource theme="outline" size="24" fill="#04A17E" />
				{collapsed && (
					<span className={styles.logoTitle} style={{ color: "#04A17E" }}>
						{title}
					</span>
				)}
			</div>
			<div className={styles.menuContainer}>
				<Menu
					items={menuList}
					theme="dark"
					mode="inline"
					selectedKeys={selectedKeys}
					openKeys={openKeys}
					triggerSubMenuAction="click"
					inlineIndent={24}
					onClick={clickMenu}
					onOpenChange={onOpenChange}
				/>
			</div>
		</React.Fragment>
	);
};

export default AppNav;
