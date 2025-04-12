import { Layout } from "antd";
import { createStyles } from "antd-style";
import { useAtomValue } from "jotai";
import { Outlet } from "react-router";
import { appJotai } from "~/store";
import AppNav from "./AppNav";
import AppHeader from "./AppHeader";

const useStyles = createStyles(() => {
	return {
		appContainer: {
			display: "flex",
			width: "100vw",
			height: "100vh",
		},
	};
});
const AppLayout = () => {
	const { Sider, Content } = Layout;
	const { styles } = useStyles();
	const navCollapsed = useAtomValue(appJotai.navCollapsedAtom);

	return (
		<Layout className={styles.appContainer}>
			<Sider collapsed={!navCollapsed} width={230}>
				<AppNav collapsed={navCollapsed} />
			</Sider>
			<Layout>
				<AppHeader />
				<Content
					style={{
						padding: "30px",
						height: "100%",
						overflow: "auto",
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

export default AppLayout;
