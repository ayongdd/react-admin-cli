import { LogoutOutlined } from "@ant-design/icons";
import { Down, MenuFoldOne, MenuUnfoldOne } from "@icon-park/react";
import {
	Avatar,
	Button,
	Dropdown,
	type MenuProps,
	message,
	Typography,
} from "antd";
import { createStyles } from "antd-style";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import type React from "react";
import { useNavigate } from "react-router";
import { useRouteMeta } from "~/hooks/useRouteMeta";
import { appJotai, authJotai } from "~/store";
import { getUserInfo } from "~/utils";

const useStyles = createStyles(() => {
	return {
		headerContainer: {
			height: "56px",
			display: "flex",
			justifyContent: "space-between",
			width: "100%",
			alignItems: "center",
			boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
		},
		headerLeft: {
			display: "flex",
			alignItems: "center",
			marginLeft: "10px",
		},
		actionBarContainer: {
			display: "flex",
			alignItems: "center",
			cursor: "pointer",
			paddingRight: "10px",
			marginRight: "10px",
			padding: "7px",
			borderRadius: "7px",
			":hover": {
				backgroundColor: "rgb(229 231 235 / 0.5)",
			},
		},
		actionTitle: {
			fontSize: "14px",
			fontWeight: "500",
		},
	};
});

const ActionBar: React.FC = () => {
	const { styles } = useStyles();
	const navigate = useNavigate();
	const setToken = useSetAtom(authJotai.tokenAtom);
	const setAuthInfo = useSetAtom(authJotai.authInfoAtom);
	const setPerms = useSetAtom(authJotai.permAtom);

	// const toProfile = () => {
	//   navigate('/profile')
	// }

	const logout = () => {
		setToken(RESET);
		setAuthInfo(RESET);
		setPerms(RESET);
		navigate("/login");
		message.success("注销成功");
	};

	const items: MenuProps["items"] = [
		// {
		//   key: 'profile',
		//   label: '个人信息',
		//   icon: <ProfileTwoTone style={{ fontSize: '16px' }} />,
		//   onClick: toProfile
		// },
		{
			key: "logout",
			icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
			danger: true,
			onClick: logout,
			label: "注销登录",
		},
	];

	return (
		<Dropdown menu={{ items }} placement="top" trigger={["click"]}>
			<div className={styles.actionBarContainer}>
				<Avatar shape="square" style={{ marginRight: "10px" }} />
				<span className={styles.actionTitle}>
					{(getUserInfo() as ApiType.User.Info)?.tenant_name ?? "管理员"}
				</span>
				<Down
					theme="outline"
					size="16"
					fill="#333"
					strokeWidth={3}
					strokeLinecap="square"
				/>
			</div>
		</Dropdown>
	);
};

const AppHeader: React.FC = () => {
	const { styles } = useStyles();
	const [collapseMenu, setCollapseMenu] = useAtom(appJotai.navCollapsedAtom);
	const routeMeta = useRouteMeta();

	const toggleCollapseMenu = () => {
		setCollapseMenu(!collapseMenu);
	};

	return (
		<div className={styles.headerContainer}>
			<div className={styles.headerLeft}>
				<Button
					type="text"
					icon={
						collapseMenu ? (
							<MenuUnfoldOne
								theme="outline"
								size="20"
								fill="#020202"
								strokeWidth={3}
								strokeLinecap="square"
							/>
						) : (
							<MenuFoldOne
								theme="outline"
								size="20"
								fill="#020202"
								strokeWidth={3}
								strokeLinecap="square"
							/>
						)
					}
					onClick={toggleCollapseMenu}
				/>
				<div
					style={{
						borderRadius: "0.5rem",
						height: "20px",
						width: "4px",
						marginRight: "5px",
						marginLeft: "10px",
						backgroundColor: "#1d1db7",
					}}
				/>
				<Typography.Text>{routeMeta.title}</Typography.Text>
			</div>
			<div>
				<ActionBar />
			</div>
		</div>
	);
};

export default AppHeader;
